"""
FiduScan Inference Benchmark
============================
Measures:
- inference latency (p50, p95, p99)
- throughput (images/sec)
- memory usage
- model accuracy on test set

Usage:
    python training/evaluate.py --config training/config.yaml
    python training/evaluate.py --model-path models/efficientnet_b0_fiduscan.pth --test-dir datasets/processed
"""

import argparse
import json
import sys
import time
import tracemalloc
from pathlib import Path

import torch
import torch.nn.functional as F
import yaml
from PIL import Image
from sklearn.metrics import (
    accuracy_score, f1_score, precision_score, recall_score,
    roc_auc_score, confusion_matrix, classification_report,
)
from torchvision import transforms
from tqdm import tqdm

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))

from ai_engine.model import build_model
from datasets.loader import build_dataloaders

REPORTS_DIR = ROOT / "reports" / "inference"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

PREPROCESS = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


def resolve_device():
    if torch.backends.mps.is_available():
        return torch.device("mps")
    elif torch.cuda.is_available():
        return torch.device("cuda")
    return torch.device("cpu")


def benchmark_latency(model, device, n_warmup: int = 10, n_runs: int = 100) -> dict:
    """Measure single-image inference latency statistics."""
    dummy = torch.randn(1, 3, 224, 224).to(device)
    latencies = []

    # Warmup
    with torch.no_grad():
        for _ in range(n_warmup):
            _ = model(dummy)

    # Timed runs
    for _ in range(n_runs):
        if device.type == "cuda":
            torch.cuda.synchronize()
        t0 = time.perf_counter()
        with torch.no_grad():
            _ = model(dummy)
        if device.type == "cuda":
            torch.cuda.synchronize()
        latencies.append((time.perf_counter() - t0) * 1000)  # ms

    latencies.sort()
    return {
        "n_runs": n_runs,
        "p50_ms": round(latencies[n_runs // 2], 3),
        "p95_ms": round(latencies[int(n_runs * 0.95)], 3),
        "p99_ms": round(latencies[int(n_runs * 0.99)], 3),
        "mean_ms": round(sum(latencies) / len(latencies), 3),
        "min_ms": round(latencies[0], 3),
        "max_ms": round(latencies[-1], 3),
        "throughput_imgs_per_sec": round(1000 / (sum(latencies) / len(latencies)), 1),
    }


def benchmark_accuracy(model, test_loader, device) -> dict:
    """Run accuracy evaluation on the test set."""
    model.eval()
    all_preds, all_labels, all_probs = [], [], []

    with torch.no_grad():
        for images, labels in tqdm(test_loader, desc="  Evaluating accuracy"):
            images, labels = images.to(device), labels.to(device)
            logits = model(images)
            probs = F.softmax(logits, dim=1)[:, 1]
            preds = logits.argmax(dim=1)
            all_preds.extend(preds.cpu().tolist())
            all_labels.extend(labels.cpu().tolist())
            all_probs.extend(probs.cpu().tolist())

    cm = confusion_matrix(all_labels, all_preds).tolist()
    tn, fp, fn, tp = (
        cm[0][0], cm[0][1], cm[1][0], cm[1][1]
    ) if len(cm) == 2 else (0, 0, 0, 0)

    try:
        auc = roc_auc_score(all_labels, all_probs)
    except Exception:
        auc = 0.0

    return {
        "accuracy": round(accuracy_score(all_labels, all_preds), 6),
        "f1": round(f1_score(all_labels, all_preds, average="binary", zero_division=0), 6),
        "precision": round(precision_score(all_labels, all_preds, average="binary", zero_division=0), 6),
        "recall": round(recall_score(all_labels, all_preds, average="binary", zero_division=0), 6),
        "roc_auc": round(auc, 6),
        "confusion_matrix": cm,
        "true_positives": tp,
        "true_negatives": tn,
        "false_positives": fp,
        "false_negatives": fn,
        "classification_report": classification_report(
            all_labels, all_preds,
            target_names=["AUTHENTIC", "AI_GENERATED"],
            output_dict=True,
        ),
    }


def measure_memory(model, device) -> dict:
    """Estimate model memory footprint."""
    param_count = sum(p.numel() for p in model.parameters())
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    size_mb = sum(p.numel() * p.element_size() for p in model.parameters()) / (1024 ** 2)

    result = {
        "total_parameters": param_count,
        "trainable_parameters": trainable,
        "model_size_mb": round(size_mb, 2),
    }

    if device.type == "cuda":
        result["gpu_memory_allocated_mb"] = round(
            torch.cuda.memory_allocated(device) / (1024 ** 2), 2
        )
        result["gpu_memory_reserved_mb"] = round(
            torch.cuda.memory_reserved(device) / (1024 ** 2), 2
        )

    return result


def run_evaluation(config: dict) -> dict:
    device = resolve_device()
    print(f"\n{'='*62}")
    print("  📊 FiduScan Inference Benchmark")
    print(f"  Device: {device}")
    print(f"{'='*62}\n")

    model = build_model(num_classes=2)
    model_path = ROOT / config["checkpointing"]["save_dir"] / "efficientnet_b0_fiduscan.pth"

    if model_path.exists():
        state = torch.load(model_path, map_location=device)
        if isinstance(state, dict) and "model_state_dict" in state:
            state = state["model_state_dict"]
        model.load_state_dict(state)
        print(f"  ✅ Loaded: {model_path}")
    else:
        print(f"  ⚠️  No trained model found at {model_path}")
        print("     Running benchmark with random weights (accuracy metrics will be meaningless)")

    model.to(device).eval()

    _, _, test_loader = build_dataloaders(
        raw_dir=ROOT / config["data"]["dataset_path"],
        batch_size=config["training"]["batch_size"],
    )

    print("\n  ⏱️  Measuring inference latency...")
    latency = benchmark_latency(model, device)

    print("  🎯 Evaluating accuracy on test set...")
    try:
        accuracy = benchmark_accuracy(model, test_loader, device)
    except Exception as exc:
        accuracy = {"error": str(exc)}

    print("  💾 Measuring memory footprint...")
    memory = measure_memory(model, device)

    report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "model": "efficientnet_b0",
        "device": str(device),
        "latency": latency,
        "accuracy": accuracy,
        "memory": memory,
    }

    report_path = REPORTS_DIR / "inference_benchmark.json"
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)

    _print_benchmark(report)
    print(f"\n  📄 Benchmark report: {report_path}")
    return report


def _print_benchmark(report: dict):
    lat = report["latency"]
    acc = report.get("accuracy", {})
    mem = report["memory"]
    print(f"\n  ── Latency ──────────────────────────────────────────")
    print(f"  p50: {lat['p50_ms']}ms | p95: {lat['p95_ms']}ms | p99: {lat['p99_ms']}ms")
    print(f"  Throughput: {lat['throughput_imgs_per_sec']} images/sec")
    if "accuracy" in acc:
        print(f"\n  ── Accuracy ─────────────────────────────────────────")
        print(f"  Accuracy : {acc['accuracy']:.4f}")
        print(f"  F1       : {acc['f1']:.4f}")
        print(f"  ROC-AUC  : {acc['roc_auc']:.4f}")
        print(f"  TP: {acc['true_positives']} | TN: {acc['true_negatives']} | FP: {acc['false_positives']} | FN: {acc['false_negatives']}")
    print(f"\n  ── Memory ───────────────────────────────────────────")
    print(f"  Parameters : {mem['total_parameters']:,}")
    print(f"  Model size : {mem['model_size_mb']} MB")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FiduScan Inference Benchmark")
    parser.add_argument("--config", default="training/config.yaml")
    args = parser.parse_args()
    with open(ROOT / args.config) as f:
        config = yaml.safe_load(f)
    run_evaluation(config)
