"""
Multi-model benchmark: trains all 3 architectures and produces a comparison report.

Usage:
    python training/benchmark.py --config training/config.yaml
"""

import json
import sys
import time
from pathlib import Path

import yaml

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))

from training.train import train

REPORTS_DIR = ROOT / "reports" / "training"
MODELS = ["efficientnet_b0", "resnet50", "vit_b16"]


def run_benchmark(config: dict) -> dict:
    results = {}
    for model_name in MODELS:
        print(f"\n\n{'#'*62}")
        print(f"  BENCHMARKING: {model_name.upper()}")
        print(f"{'#'*62}")
        t0 = time.time()
        try:
            report = train(config, model_name=model_name)
            results[model_name] = {
                "status": "success",
                "test_accuracy": report["test_metrics"]["accuracy"],
                "test_f1": report["test_metrics"]["f1"],
                "test_precision": report["test_metrics"]["precision"],
                "test_recall": report["test_metrics"]["recall"],
                "test_roc_auc": report["test_metrics"]["roc_auc"],
                "training_time_sec": report["training_time_sec"],
                "epochs_completed": report["epochs_completed"],
                "artifact_sha256": report.get("artifact_sha256"),
            }
        except Exception as exc:
            results[model_name] = {"status": "failed", "error": str(exc)}

    # Rank by F1
    ranked = sorted(
        [(k, v) for k, v in results.items() if v.get("status") == "success"],
        key=lambda x: x[1]["test_f1"],
        reverse=True,
    )

    benchmark_report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "models": results,
        "ranking_by_f1": [r[0] for r in ranked],
        "recommended_model": ranked[0][0] if ranked else "efficientnet_b0",
    }

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report_path = REPORTS_DIR / "benchmark_report.json"
    with open(report_path, "w") as f:
        json.dump(benchmark_report, f, indent=2)

    _print_summary(benchmark_report)
    print(f"\n  📄 Benchmark report: {report_path}")
    return benchmark_report


def _print_summary(report: dict):
    print(f"\n{'='*62}")
    print("  🏆 BENCHMARK RESULTS")
    print(f"{'='*62}")
    print(f"  {'Model':<22} {'F1':>7} {'Accuracy':>10} {'AUC':>8} {'Time':>8}")
    print(f"  {'─'*22} {'─'*7} {'─'*10} {'─'*8} {'─'*8}")
    for name, m in report["models"].items():
        if m.get("status") == "success":
            marker = " ⭐" if name == report["recommended_model"] else ""
            print(
                f"  {name:<22} {m['test_f1']:>7.4f} {m['test_accuracy']:>10.4f} "
                f"{m['test_roc_auc']:>8.4f} {m['training_time_sec']:>6.0f}s{marker}"
            )
        else:
            print(f"  {name:<22} {'FAILED':>7}")
    print(f"\n  Recommended: {report['recommended_model']}")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="training/config.yaml")
    args = parser.parse_args()
    with open(ROOT / args.config) as f:
        config = yaml.safe_load(f)
    run_benchmark(config)
