"""
FiduScan Training Pipeline — Enhanced
EfficientNet-B0 with early stopping, full state saving, and benchmark evaluation.

Usage:
    python training/train.py --config training/config.yaml
    python training/train.py --config training/config.yaml --model resnet50
"""

import argparse
import json
import sys
import time
from pathlib import Path

import torch
import torch.nn as nn
import yaml
from sklearn.metrics import (
    accuracy_score, f1_score, precision_score, recall_score,
    roc_auc_score, confusion_matrix, classification_report,
)
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR
from tqdm import tqdm

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))

from ai_engine.model import get_model
from datasets.loader import build_dataloaders
from security.crypto import hash_model_artifact

LOGS_DIR = ROOT / "logs"
REPORTS_DIR = ROOT / "reports" / "training"
LOGS_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_DIR.mkdir(parents=True, exist_ok=True)


# ─── Device ───────────────────────────────────────────────────────────────────

def resolve_device(cfg_device: str) -> torch.device:
    if cfg_device == "auto":
        if torch.backends.mps.is_available():
            print("🍎 Device: Apple Silicon MPS")
            return torch.device("mps")
        elif torch.cuda.is_available():
            print(f"⚡ Device: CUDA — {torch.cuda.get_device_name(0)}")
            return torch.device("cuda")
        else:
            print("⚠️  Device: CPU (no GPU available)")
            return torch.device("cpu")
    return torch.device(cfg_device)


# ─── Early Stopping ───────────────────────────────────────────────────────────

class EarlyStopping:
    def __init__(self, patience: int = 3, min_delta: float = 1e-4):
        self.patience = patience
        self.min_delta = min_delta
        self.counter = 0
        self.best = None
        self.triggered = False

    def step(self, metric: float) -> bool:
        if self.best is None or metric > self.best + self.min_delta:
            self.best = metric
            self.counter = 0
        else:
            self.counter += 1
            if self.counter >= self.patience:
                self.triggered = True
        return self.triggered


# ─── Evaluation ───────────────────────────────────────────────────────────────

@torch.no_grad()
def evaluate(model, loader, device, criterion) -> dict:
    model.eval()
    all_preds, all_labels, all_probs = [], [], []
    total_loss = 0.0

    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        logits = model(images)
        loss = criterion(logits, labels)
        total_loss += loss.item() * len(labels)

        probs = torch.softmax(logits, dim=1)[:, 1]   # P(AI_Generated)
        preds = logits.argmax(dim=1)

        all_preds.extend(preds.cpu().tolist())
        all_labels.extend(labels.cpu().tolist())
        all_probs.extend(probs.cpu().tolist())

    n = len(loader.dataset)
    avg_loss = total_loss / n
    acc = accuracy_score(all_labels, all_preds)
    f1 = f1_score(all_labels, all_preds, average="binary", zero_division=0)
    prec = precision_score(all_labels, all_preds, average="binary", zero_division=0)
    rec = recall_score(all_labels, all_preds, average="binary", zero_division=0)

    try:
        auc = roc_auc_score(all_labels, all_probs)
    except Exception:
        auc = 0.0

    return {
        "loss": round(avg_loss, 6),
        "accuracy": round(acc, 6),
        "f1": round(f1, 6),
        "precision": round(prec, 6),
        "recall": round(rec, 6),
        "roc_auc": round(auc, 6),
        "_preds": all_preds,
        "_labels": all_labels,
        "_probs": all_probs,
    }


# ─── Training Loop ────────────────────────────────────────────────────────────

def train(config: dict, model_name: str | None = None) -> dict:
    device = resolve_device(config["training"]["device"])
    model_arch = model_name or config["model"]["architecture"]

    # ── Data ─────────────────────────────────────────────────────────────────
    data_cfg = config["data"]
    train_loader, val_loader, test_loader = build_dataloaders(
        raw_dir=ROOT / data_cfg["dataset_path"],
        batch_size=config["training"]["batch_size"],
        train_ratio=data_cfg["train_ratio"],
        val_ratio=data_cfg["val_ratio"],
        num_workers=data_cfg.get("num_workers", 4),
    )

    # ── Model ─────────────────────────────────────────────────────────────────
    model = get_model(
        name=model_arch,
        num_classes=config["model"]["num_classes"],
        pretrained=config["model"]["pretrained"],
    ).to(device)

    # ── Optimizer + Scheduler + Criterion ────────────────────────────────────
    tr_cfg = config["training"]
    optimizer = AdamW(
        model.parameters(),
        lr=tr_cfg["learning_rate"],
        weight_decay=tr_cfg["weight_decay"],
    )
    criterion = nn.CrossEntropyLoss(label_smoothing=tr_cfg.get("label_smoothing", 0.0))
    scheduler = CosineAnnealingLR(optimizer, T_max=tr_cfg["epochs"])
    early_stop = EarlyStopping(patience=tr_cfg.get("early_stopping_patience", 3))

    # ── Checkpoint setup ──────────────────────────────────────────────────────
    ckpt_cfg = config["checkpointing"]
    save_dir = ROOT / ckpt_cfg["save_dir"]
    save_dir.mkdir(parents=True, exist_ok=True)
    best_metric_val = 0.0
    best_model_path = save_dir / f"{model_arch}_fiduscan.pth"

    print(f"\n{'='*62}")
    print(f"  🚀 FiduScan Training — {model_arch.upper()}")
    print(f"  Epochs  : {tr_cfg['epochs']} | Batch: {tr_cfg['batch_size']} | LR: {tr_cfg['learning_rate']}")
    print(f"  Device  : {device} | Early-stop patience: {early_stop.patience}")
    print(f"{'='*62}\n")

    train_log = []
    training_start = time.time()

    for epoch in range(1, tr_cfg["epochs"] + 1):
        model.train()
        epoch_loss = 0.0
        epoch_start = time.time()

        bar = tqdm(train_loader, desc=f"Epoch {epoch:>2}/{tr_cfg['epochs']}", unit="batch",
                   leave=False)
        for images, labels in bar:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            logits = model(images)
            loss = criterion(logits, labels)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()
            epoch_loss += loss.item()
            bar.set_postfix({"loss": f"{loss.item():.4f}"})

        scheduler.step()
        avg_train_loss = epoch_loss / len(train_loader)
        val_metrics = evaluate(model, val_loader, device, criterion)
        elapsed = time.time() - epoch_start

        entry = {
            "epoch": epoch,
            "train_loss": round(avg_train_loss, 6),
            **{f"val_{k}": v for k, v in val_metrics.items() if not k.startswith("_")},
            "lr": round(scheduler.get_last_lr()[0], 8),
            "elapsed_sec": round(elapsed, 1),
        }
        train_log.append(entry)

        print(
            f"  Ep {epoch:>2} | Loss {avg_train_loss:.4f} | "
            f"Acc {val_metrics['accuracy']:.4f} | F1 {val_metrics['f1']:.4f} | "
            f"AUC {val_metrics['roc_auc']:.4f} | {elapsed:.0f}s"
        )

        # ── Save periodic checkpoint ──────────────────────────────────────────
        if epoch % ckpt_cfg.get("save_every_n_epochs", 2) == 0:
            ckpt_path = save_dir / f"{model_arch}_epoch{epoch}.pth"
            torch.save({
                "epoch": epoch,
                "model_state_dict": model.state_dict(),
                "optimizer_state_dict": optimizer.state_dict(),
                "scheduler_state_dict": scheduler.state_dict(),
                "val_metrics": {k: v for k, v in val_metrics.items() if not k.startswith("_")},
            }, ckpt_path)
            if config["security"].get("hash_artifacts", True):
                h = hash_model_artifact(ckpt_path)
                print(f"  🔒 Ckpt SHA-256: {h[:20]}…")

        # ── Save best model ───────────────────────────────────────────────────
        if val_metrics[ckpt_cfg.get("metric", "val_f1").replace("val_", "")] > best_metric_val:
            best_metric_val = val_metrics[ckpt_cfg.get("metric", "val_f1").replace("val_", "")]
            torch.save(model.state_dict(), best_model_path)
            print(f"  ⭐ Best model → {best_metric_val:.4f} {ckpt_cfg.get('metric', 'val_f1')}")

        # ── Early stopping ────────────────────────────────────────────────────
        if early_stop.step(val_metrics["f1"]):
            print(f"\n  🛑 Early stopping triggered at epoch {epoch}")
            break

    # ── Final test evaluation ─────────────────────────────────────────────────
    print(f"\n{'─'*62}")
    print("  📊 Final Test Set Evaluation")
    if best_model_path.exists():
        model.load_state_dict(torch.load(best_model_path, map_location=device))
    test_metrics = evaluate(model, test_loader, device, criterion)

    # Confusion matrix
    cm = confusion_matrix(test_metrics["_labels"], test_metrics["_preds"]).tolist()
    cls_report = classification_report(
        test_metrics["_labels"], test_metrics["_preds"],
        target_names=["AUTHENTIC", "AI_GENERATED"],
        output_dict=True,
    )

    total_time = time.time() - training_start
    print(f"  Accuracy  : {test_metrics['accuracy']:.4f}")
    print(f"  F1        : {test_metrics['f1']:.4f}")
    print(f"  Precision : {test_metrics['precision']:.4f}")
    print(f"  Recall    : {test_metrics['recall']:.4f}")
    print(f"  ROC-AUC   : {test_metrics['roc_auc']:.4f}")
    print(f"  Total time: {total_time:.0f}s")

    # ── Hash best artifact ────────────────────────────────────────────────────
    artifact_hash = None
    if best_model_path.exists() and config["security"].get("hash_artifacts", True):
        artifact_hash = hash_model_artifact(best_model_path)
        print(f"\n  🔒 Model SHA-256: {artifact_hash}")

    # ── Write full report ─────────────────────────────────────────────────────
    clean_test = {k: v for k, v in test_metrics.items() if not k.startswith("_")}
    full_report = {
        "model": model_arch,
        "device": str(device),
        "training_time_sec": round(total_time, 1),
        "epochs_completed": len(train_log),
        "train_log": train_log,
        "test_metrics": clean_test,
        "confusion_matrix": cm,
        "classification_report": cls_report,
        "best_model_path": str(best_model_path),
        "artifact_sha256": artifact_hash,
    }

    report_path = REPORTS_DIR / f"{model_arch}_training_report.json"
    with open(report_path, "w") as f:
        json.dump(full_report, f, indent=2)

    log_path = LOGS_DIR / "training.log"
    with open(log_path, "w") as f:
        json.dump(full_report, f, indent=2)

    print(f"\n  📄 Report: {report_path}")
    return full_report


# ─── Entry ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FiduScan Training Pipeline")
    parser.add_argument("--config", default="training/config.yaml")
    parser.add_argument("--model", default=None,
                        help="Override model architecture (efficientnet_b0 | resnet50 | vit_b16)")
    args = parser.parse_args()

    with open(ROOT / args.config) as f:
        config = yaml.safe_load(f)

    train(config, model_name=args.model)
