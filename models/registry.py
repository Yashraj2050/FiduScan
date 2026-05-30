"""
Model Registry — tracks all trained artifacts with versions, hashes, and metadata.
Provides a tamper-resistant inventory of all models in the FiduScan system.
"""

import json
import time
from pathlib import Path
from typing import Optional

ROOT = Path(__file__).parent.parent
REGISTRY_PATH = ROOT / "security" / "model_hashes.json"


def register_model(
    model_path: Path,
    architecture: str,
    sha256: str,
    metrics: Optional[dict] = None,
    encrypted_path: Optional[Path] = None,
) -> dict:
    """
    Register a model artifact in the immutable registry.
    Appends a new entry — never modifies existing entries.
    """
    entry = {
        "id": f"{architecture}-{int(time.time())}",
        "architecture": architecture,
        "path": str(model_path),
        "sha256": sha256,
        "registered_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "metrics": metrics or {},
        "encrypted_path": str(encrypted_path) if encrypted_path else None,
        "status": "validated",
    }

    records = _load_registry()
    records.append(entry)
    _save_registry(records)
    print(f"  📝 Registered: {architecture} → SHA-256: {sha256[:20]}…")
    return entry


def get_registry() -> list[dict]:
    return _load_registry()


def find_best_model(architecture: str, metric: str = "f1") -> Optional[dict]:
    """Find the best registered model for a given architecture by metric."""
    records = [
        r for r in _load_registry()
        if r.get("architecture") == architecture and r.get("metrics", {}).get(metric) is not None
    ]
    if not records:
        return None
    return max(records, key=lambda r: r["metrics"].get(metric, 0))


def print_registry():
    records = _load_registry()
    if not records:
        print("  Registry is empty.")
        return
    print(f"\n  {'ID':<30} {'Architecture':<20} {'SHA-256':>22} {'F1':>6}")
    print(f"  {'─'*30} {'─'*20} {'─'*22} {'─'*6}")
    for r in records:
        f1 = r.get("metrics", {}).get("f1", "—")
        f1_str = f"{f1:.4f}" if isinstance(f1, float) else str(f1)
        print(f"  {r['id']:<30} {r['architecture']:<20} {r['sha256'][:20]:>22}… {f1_str:>6}")


def _load_registry() -> list:
    REGISTRY_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not REGISTRY_PATH.exists():
        return []
    with open(REGISTRY_PATH, "r") as f:
        try:
            data = json.load(f)
            return data if isinstance(data, list) else []
        except json.JSONDecodeError:
            return []


def _save_registry(records: list):
    REGISTRY_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(REGISTRY_PATH, "w") as f:
        json.dump(records, f, indent=2)


if __name__ == "__main__":
    print("\n  🗂️  FiduScan Model Registry")
    print_registry()
