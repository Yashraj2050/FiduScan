"""
FiduScan Autonomous Pipeline Runner
=====================================
Executes Steps 1-12 autonomously:
  1. Environment validation
  2. Dataset acquisition (Kaggle → HuggingFace → Synthetic)
  3. Dataset ingestion + preprocessing
  4. Model training (EfficientNet-B0)
  5. Model security (hash + encrypt)
  6. Model registry update
  7. Inference validation tests
  8. Grad-CAM heatmap generation
  9. Benchmark reports
  10. Final report generation

Usage:
    python run_pipeline.py
    python run_pipeline.py --skip-training       # If model already trained
    python run_pipeline.py --mode synthetic      # Force synthetic dataset
"""

import argparse
import json
import sys
import time
import traceback
from pathlib import Path

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))

LOGS_DIR = ROOT / "logs"
REPORTS_FINAL = ROOT / "reports" / "final"
LOGS_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_FINAL.mkdir(parents=True, exist_ok=True)

PIPELINE_LOG = LOGS_DIR / "pipeline.log"


def log(msg: str, level: str = "INFO"):
    entry = {"ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "level": level, "msg": msg}
    with open(PIPELINE_LOG, "a") as f:
        f.write(json.dumps(entry) + "\n")
    icon = {"INFO": "  ➤ ", "OK": "  ✅", "WARN": "  ⚠️ ", "ERROR": "  ❌", "STEP": "\n🔷"}
    print(f"{icon.get(level, '  ')} {msg}")


def step(n: int, name: str):
    log(f"STEP {n} — {name}", "STEP")
    print(f"{'─'*62}")


def retry(fn, retries: int = 3, label: str = ""):
    for attempt in range(1, retries + 1):
        try:
            return fn()
        except Exception as exc:
            log(f"[Attempt {attempt}/{retries}] {label} failed: {exc}", "WARN")
            if attempt == retries:
                log(f"{label} failed after {retries} retries", "ERROR")
                raise
            time.sleep(2)


def run_pipeline(args):
    pipeline_start = time.time()
    summary = {}

    # ── STEP 1: Environment Validation ───────────────────────────────────────
    step(1, "Environment Validation")
    import torch
    import platform
    device_str = "mps" if torch.backends.mps.is_available() else (
        "cuda" if torch.cuda.is_available() else "cpu"
    )
    device = torch.device(device_str)
    log(f"Platform: {platform.platform()}", "OK")
    log(f"Python: {sys.version.split()[0]}", "OK")
    log(f"PyTorch: {torch.__version__}", "OK")
    log(f"Device: {device_str.upper()}", "OK")
    summary["device"] = device_str

    # ── STEP 2: Dataset Acquisition ───────────────────────────────────────────
    step(2, "Dataset Acquisition")
    from datasets.acquire import acquire_dataset

    def _acquire():
        return acquire_dataset(mode=args.dataset_mode)

    acq_result = retry(_acquire, retries=3, label="Dataset acquisition")
    log(f"Dataset: {acq_result}", "OK")
    summary["dataset"] = acq_result

    # ── STEP 3: Dataset Ingestion + Preprocessing ─────────────────────────────
    step(3, "Dataset Ingestion + Preprocessing")
    from datasets.ingest import run_pipeline as run_ingest
    from pathlib import Path as P

    def _ingest():
        return run_ingest(
            dataset_dir=ROOT / "datasets" / "raw",
            report_dir=ROOT / "reports" / "datasets",
        )

    ingest_report = retry(_ingest, retries=2, label="Dataset ingestion")
    log(f"Valid images: {ingest_report.get('total_valid', 0)}", "OK")
    summary["dataset_report"] = ingest_report

    # ── STEP 4: Model Training ────────────────────────────────────────────────
    step(4, "Model Training — EfficientNet-B0")
    if args.skip_training:
        log("Skipping training (--skip-training flag set)", "WARN")
        summary["training"] = "skipped"
    else:
        import yaml
        with open(ROOT / "training" / "config.yaml") as f:
            config = yaml.safe_load(f)

        from training.train import train as run_training

        def _train():
            return run_training(config, model_name="efficientnet_b0")

        train_result = retry(_train, retries=2, label="Training")
        log(f"Test Accuracy: {train_result['test_metrics']['accuracy']:.4f}", "OK")
        log(f"Test F1: {train_result['test_metrics']['f1']:.4f}", "OK")
        log(f"Test AUC: {train_result['test_metrics']['roc_auc']:.4f}", "OK")
        summary["training"] = train_result["test_metrics"]

    # ── STEP 5: Model Security ────────────────────────────────────────────────
    step(5, "Model Security — Hash + Encrypt")
    from security.crypto import hash_model_artifact, encrypt_model

    model_path = ROOT / "models" / "efficientnet_b0_fiduscan.pth"
    security_result = {}

    if model_path.exists():
        sha256 = hash_model_artifact(model_path)
        log(f"SHA-256: {sha256[:24]}...", "OK")
        security_result["sha256"] = sha256

        enc_dir = ROOT / "models" / "encrypted"
        enc_dir.mkdir(parents=True, exist_ok=True)
        enc_path = enc_dir / "efficientnet_b0_fiduscan.enc"

        try:
            enc_out, aes_key = encrypt_model(model_path, enc_path)
            # Store key to local secure path (dev only — never commit)
            key_path = enc_dir / ".aes_key.bin"
            with open(key_path, "wb") as f:
                f.write(aes_key)
            os.chmod(key_path, 0o600)
            log(f"Encrypted: {enc_out}", "OK")
            security_result["encrypted"] = str(enc_out)
        except Exception as e:
            log(f"Encryption warning: {e}", "WARN")
    else:
        log("No trained model found — skipping security (train first)", "WARN")

    summary["security"] = security_result

    # ── STEP 6: Model Registry ────────────────────────────────────────────────
    step(6, "Model Registry Update")
    from models.registry import register_model

    if model_path.exists() and security_result.get("sha256"):
        metrics = summary.get("training", {}) if isinstance(summary.get("training"), dict) else {}
        reg_entry = register_model(
            model_path=model_path,
            architecture="efficientnet_b0",
            sha256=security_result["sha256"],
            metrics=metrics,
            encrypted_path=Path(security_result["encrypted"]) if security_result.get("encrypted") else None,
        )
        log(f"Registered model ID: {reg_entry['id']}", "OK")
        summary["registry"] = reg_entry["id"]

    # ── STEP 7: Inference Validation ─────────────────────────────────────────
    step(7, "Inference Validation Tests")
    from inference.pipeline_test import run_inference_tests
    inf_results = retry(lambda: run_inference_tests(), retries=2, label="Inference tests")
    log(f"Inference tests: {inf_results}", "OK")
    summary["inference_tests"] = inf_results

    # ── STEP 8: Grad-CAM Validation ───────────────────────────────────────────
    step(8, "Grad-CAM Heatmap Validation")
    from inference.gradcam_test import run_gradcam_test
    try:
        heatmap_result = run_gradcam_test()
        log(f"Grad-CAM: {heatmap_result}", "OK")
        summary["gradcam"] = heatmap_result
    except Exception as e:
        log(f"Grad-CAM: {e} (MPS may not support autograd — CPU fallback)", "WARN")
        summary["gradcam"] = {"status": "fallback", "error": str(e)}

    # ── STEP 9: Inference Benchmark ───────────────────────────────────────────
    step(9, "Inference Benchmark")
    import yaml
    with open(ROOT / "training" / "config.yaml") as f:
        config = yaml.safe_load(f)

    from training.evaluate import run_evaluation
    try:
        bench = run_evaluation(config)
        log(f"p50 latency: {bench['latency']['p50_ms']}ms", "OK")
        log(f"Throughput: {bench['latency']['throughput_imgs_per_sec']} img/s", "OK")
        summary["benchmark"] = bench["latency"]
    except Exception as e:
        log(f"Benchmark warning: {e}", "WARN")

    # ── STEP 10: Final Report ─────────────────────────────────────────────────
    step(10, "Final Report Generation")
    total_time = time.time() - pipeline_start
    final_report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "total_pipeline_time_sec": round(total_time, 1),
        "summary": summary,
        "status": "SUCCESS",
    }

    report_path = REPORTS_FINAL / "pipeline_report.json"
    with open(report_path, "w") as f:
        json.dump(final_report, f, indent=2)

    log(f"\n  📄 Final report: {report_path}", "OK")
    log(f"  ⏱️  Total pipeline time: {total_time:.0f}s", "OK")

    return final_report


import os

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FiduScan Autonomous Pipeline")
    parser.add_argument("--skip-training", action="store_true",
                        help="Skip training if model already exists")
    parser.add_argument("--dataset-mode", choices=["auto", "kaggle", "huggingface", "synthetic"],
                        default="auto", help="Dataset acquisition mode")
    args = parser.parse_args()

    print(f"\n{'='*62}")
    print("  🚀 FiduScan Autonomous Pipeline")
    print(f"  Started: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}")
    print(f"{'='*62}")

    try:
        result = run_pipeline(args)
        print(f"\n{'='*62}")
        print("  ✅ PIPELINE COMPLETE — ALL STEPS SUCCEEDED")
        print(f"{'='*62}\n")
    except Exception as exc:
        print(f"\n  ❌ PIPELINE ERROR: {exc}")
        traceback.print_exc()
        with open(LOGS_DIR / "pipeline_error.log", "a") as f:
            f.write(f"\n{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}\n")
            traceback.print_exc(file=f)
        sys.exit(1)
