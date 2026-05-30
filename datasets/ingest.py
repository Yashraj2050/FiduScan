"""
FiduScan Dataset Ingestion Pipeline
====================================
Automated end-to-end pipeline:
  1. Directory initialization
  2. Image integrity validation (magic bytes + PIL verify)
  3. Duplicate detection via SHA-256
  4. Format normalization (convert to JPEG/PNG if needed)
  5. Resize + cache preprocessed tensors
  6. Dataset statistics report generation

Usage:
    python datasets/ingest.py [--dataset-dir datasets/raw] [--report-dir reports/training]
"""

import argparse
import hashlib
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Optional

from PIL import Image, UnidentifiedImageError
from tqdm import tqdm

ROOT = Path(__file__).parent.parent
DATASETS_DIR = ROOT / "datasets"
RAW_DIR = DATASETS_DIR / "raw"
PROCESSED_DIR = DATASETS_DIR / "processed"
CACHE_DIR = DATASETS_DIR / "cache"
REPORTS_DIR = ROOT / "reports" / "training"

VALID_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}
MAGIC_BYTES = {
    b"\xff\xd8\xff": "JPEG",
    b"\x89PNG\r\n\x1a\n": "PNG",
    b"RIFF": "WEBP",
    b"BM": "BMP",
    b"II*\x00": "TIFF",
    b"MM\x00*": "TIFF",
}
TARGET_SIZE = (224, 224)


# ─── Magic byte verification ──────────────────────────────────────────────────

def verify_magic_bytes(path: Path) -> Optional[str]:
    try:
        with open(path, "rb") as f:
            header = f.read(12)
        for sig, fmt in MAGIC_BYTES.items():
            if header[: len(sig)] == sig:
                return fmt
        return None
    except Exception:
        return None


# ─── SHA-256 file hash ────────────────────────────────────────────────────────

def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


# ─── Single image validation ──────────────────────────────────────────────────

def validate_image(path: Path, seen_hashes: dict) -> dict:
    result = {
        "path": str(path),
        "status": "valid",
        "reason": None,
        "hash": None,
        "format": None,
        "width": None,
        "height": None,
        "size_bytes": path.stat().st_size if path.exists() else 0,
    }

    # Extension check
    if path.suffix.lower() not in VALID_EXTENSIONS:
        result["status"] = "invalid"
        result["reason"] = f"bad_extension:{path.suffix}"
        return result

    # Magic byte check
    fmt = verify_magic_bytes(path)
    if fmt is None:
        result["status"] = "invalid"
        result["reason"] = "magic_byte_mismatch"
        return result
    result["format"] = fmt

    # PIL verify (catches truncated/corrupted files)
    try:
        with Image.open(path) as img:
            img.verify()
    except (UnidentifiedImageError, Exception) as e:
        result["status"] = "corrupted"
        result["reason"] = str(e)[:80]
        return result

    # Dimension check
    try:
        with Image.open(path) as img:
            result["width"], result["height"] = img.size
    except Exception:
        pass

    # Duplicate check
    file_hash = sha256_file(path)
    result["hash"] = file_hash
    if file_hash in seen_hashes:
        result["status"] = "duplicate"
        result["reason"] = f"duplicate_of:{seen_hashes[file_hash]}"
        return result

    seen_hashes[file_hash] = str(path)
    return result


# ─── Preprocessing: resize + save ────────────────────────────────────────────

def preprocess_image(src: Path, dst_dir: Path) -> bool:
    try:
        dst_dir.mkdir(parents=True, exist_ok=True)
        dst = dst_dir / (src.stem + ".jpg")
        if dst.exists():
            return True
        with Image.open(src) as img:
            img = img.convert("RGB")
            img = img.resize(TARGET_SIZE, Image.LANCZOS)
            img.save(dst, "JPEG", quality=95)
        return True
    except Exception:
        return False


# ─── Full Pipeline ────────────────────────────────────────────────────────────

def run_pipeline(dataset_dir: Path = RAW_DIR, report_dir: Path = REPORTS_DIR) -> dict:
    report_dir.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    CACHE_DIR.mkdir(parents=True, exist_ok=True)

    print(f"\n{'='*60}")
    print("  🔍 FiduScan Dataset Ingestion Pipeline")
    print(f"  Source : {dataset_dir}")
    print(f"{'='*60}\n")

    class_dirs = [d for d in sorted(dataset_dir.iterdir()) if d.is_dir()]
    if not class_dirs:
        print(f"⚠️  No class subdirectories found under {dataset_dir}")
        print("   Expected: datasets/raw/real/ and datasets/raw/fake/")
        # Create demo structure report
        return _generate_empty_report(report_dir)

    all_results = []
    seen_hashes: dict = {}
    stats_by_class = {}

    for class_dir in class_dirs:
        class_name = class_dir.name
        images = [
            p for p in class_dir.rglob("*")
            if p.is_file() and p.suffix.lower() in VALID_EXTENSIONS
        ]
        print(f"  📂 [{class_name}] — {len(images)} candidate images")

        class_results = []
        for img_path in tqdm(images, desc=f"  Validating [{class_name}]", unit="img"):
            res = validate_image(img_path, seen_hashes)
            res["class"] = class_name
            class_results.append(res)
            all_results.append(res)

        # Remove corrupted + duplicate files
        removed = 0
        for res in class_results:
            if res["status"] in ("corrupted", "duplicate", "invalid"):
                p = Path(res["path"])
                if p.exists():
                    p.unlink()
                    removed += 1

        valid = [r for r in class_results if r["status"] == "valid"]

        # Preprocess valid images
        proc_dir = PROCESSED_DIR / class_name
        print(f"  ⚙️  Preprocessing {len(valid)} valid images → {proc_dir}")
        preprocessed = 0
        with ThreadPoolExecutor(max_workers=os.cpu_count() or 4) as pool:
            futures = {
                pool.submit(preprocess_image, Path(r["path"]), proc_dir): r
                for r in valid
            }
            for fut in tqdm(as_completed(futures), total=len(futures),
                            desc=f"  Preprocessing [{class_name}]"):
                if fut.result():
                    preprocessed += 1

        stats_by_class[class_name] = {
            "total_candidates": len(images),
            "valid": len(valid),
            "corrupted": sum(1 for r in class_results if r["status"] == "corrupted"),
            "duplicate": sum(1 for r in class_results if r["status"] == "duplicate"),
            "invalid_ext": sum(1 for r in class_results if r["status"] == "invalid"),
            "removed": removed,
            "preprocessed": preprocessed,
        }

    # ── Dimensions analysis ───────────────────────────────────────────────────
    valid_results = [r for r in all_results if r["status"] == "valid" and r["width"]]
    widths = [r["width"] for r in valid_results]
    heights = [r["height"] for r in valid_results]

    dim_stats = {}
    if widths:
        dim_stats = {
            "min_width": min(widths),
            "max_width": max(widths),
            "avg_width": round(sum(widths) / len(widths)),
            "min_height": min(heights),
            "max_height": max(heights),
            "avg_height": round(sum(heights) / len(heights)),
        }

    report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "dataset_dir": str(dataset_dir),
        "classes": list(stats_by_class.keys()),
        "class_stats": stats_by_class,
        "dimension_stats": dim_stats,
        "total_valid": sum(v["valid"] for v in stats_by_class.values()),
        "total_removed": sum(v["removed"] for v in stats_by_class.values()),
        "preprocessing_target": f"{TARGET_SIZE[0]}x{TARGET_SIZE[1]}",
        "processed_dir": str(PROCESSED_DIR),
    }

    report_path = report_dir / "dataset_report.json"
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)

    _print_report(report)
    print(f"\n  📄 Report saved: {report_path}")
    return report


def _print_report(report: dict):
    print(f"\n{'─'*60}")
    print("  📊 Dataset Validation Report")
    print(f"{'─'*60}")
    for cls, stats in report["class_stats"].items():
        label = "✅ real (AUTHENTIC)" if cls == "real" else "🤖 fake (AI_GENERATED)"
        print(f"\n  {label}")
        print(f"    Total candidates : {stats['total_candidates']}")
        print(f"    Valid            : {stats['valid']}")
        print(f"    Corrupted        : {stats['corrupted']}")
        print(f"    Duplicates       : {stats['duplicate']}")
        print(f"    Invalid ext      : {stats['invalid_ext']}")
        print(f"    Preprocessed     : {stats['preprocessed']}")
    if report["dimension_stats"]:
        d = report["dimension_stats"]
        print(f"\n  Dimensions: {d['min_width']}x{d['min_height']} → {d['max_width']}x{d['max_height']} (avg {d['avg_width']}x{d['avg_height']})")
    print(f"\n  Total valid: {report['total_valid']} | Removed: {report['total_removed']}")


def _generate_empty_report(report_dir: Path) -> dict:
    """Generate a placeholder report when no dataset is present."""
    report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "status": "NO_DATASET",
        "message": (
            "No images found. Place images under:\n"
            "  datasets/raw/real/   ← authentic images\n"
            "  datasets/raw/fake/   ← AI-generated images\n\n"
            "Supported datasets: CIFAKE, Synthbuster, FaceForensics++"
        ),
        "class_stats": {},
        "total_valid": 0,
        "total_removed": 0,
    }
    report_dir.mkdir(parents=True, exist_ok=True)
    report_path = report_dir / "dataset_report.json"
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)
    print("\n⚠️  No dataset found. Placeholder report written.")
    print("   Download CIFAKE: https://www.kaggle.com/datasets/birdy654/cifake-real-and-ai-generated-synthetic-images")
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FiduScan Dataset Ingestion Pipeline")
    parser.add_argument("--dataset-dir", default=str(RAW_DIR), help="Raw dataset directory")
    parser.add_argument("--report-dir", default=str(REPORTS_DIR), help="Report output directory")
    args = parser.parse_args()
    run_pipeline(Path(args.dataset_dir), Path(args.report_dir))
