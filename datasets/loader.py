"""
Dataset Loader — validates, preprocesses, and splits image datasets for training.

Expected structure:
    datasets/raw/<dataset_name>/
        real/       ← authentic images
        fake/       ← AI-generated images

Supported datasets:
    - CIFAKE
    - Synthbuster
    - FaceForensics++ (image subset)
"""
import hashlib
import os
import shutil
from pathlib import Path
from typing import Tuple

import torch
from PIL import Image, UnidentifiedImageError
from torch.utils.data import DataLoader, Dataset, random_split
from torchvision import transforms
from tqdm import tqdm

# ─── Paths ───────────────────────────────────────────────────────────────────
DATASETS_DIR = Path(__file__).parent
RAW_DIR = DATASETS_DIR / "raw"
PROCESSED_DIR = DATASETS_DIR / "processed"

# ─── Label mapping ───────────────────────────────────────────────────────────
LABEL_MAP = {"real": 0, "fake": 1}  # 0=Authentic, 1=AI_Generated

# ─── Transforms ──────────────────────────────────────────────────────────────
TRAIN_TRANSFORMS = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(degrees=10),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.1),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

VAL_TRANSFORMS = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


# ─── Dataset Class ────────────────────────────────────────────────────────────

class ForensicDataset(Dataset):
    """PyTorch Dataset for AI-generated vs authentic image classification."""

    def __init__(self, image_paths: list[Path], labels: list[int], transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform

    def __len__(self) -> int:
        return len(self.image_paths)

    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, int]:
        img_path = self.image_paths[idx]
        label = self.labels[idx]

        try:
            image = Image.open(img_path).convert("RGB")
        except Exception:
            # Return a blank tensor for corrupted images (filtered at validation step)
            image = Image.new("RGB", (224, 224), (0, 0, 0))

        if self.transform:
            image = self.transform(image)

        return image, label


# ─── Validation ───────────────────────────────────────────────────────────────

def validate_and_clean_dataset(raw_dir: Path) -> dict:
    """
    Scans raw dataset directory for:
    - Corrupted/unreadable images → removed
    - Duplicate files (by SHA-256 hash) → removed
    - Checks for balanced class distribution

    Returns a report dict.
    """
    print(f"\n🔍 Validating dataset at: {raw_dir}")
    image_extensions = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
    seen_hashes = set()
    removed_corrupted = 0
    removed_duplicates = 0
    class_counts = {}
    valid_paths = []

    for class_dir in sorted(raw_dir.iterdir()):
        if not class_dir.is_dir():
            continue
        class_name = class_dir.name
        count = 0

        for img_path in tqdm(
            list(class_dir.rglob("*")), desc=f"  Validating [{class_name}]"
        ):
            if img_path.suffix.lower() not in image_extensions:
                continue

            # Integrity check
            try:
                with Image.open(img_path) as img:
                    img.verify()
            except (UnidentifiedImageError, Exception):
                print(f"  ❌ Corrupted: {img_path.name} — removing")
                img_path.unlink(missing_ok=True)
                removed_corrupted += 1
                continue

            # Duplicate check
            with open(img_path, "rb") as f:
                file_hash = hashlib.sha256(f.read()).hexdigest()

            if file_hash in seen_hashes:
                print(f"  🔁 Duplicate: {img_path.name} — removing")
                img_path.unlink(missing_ok=True)
                removed_duplicates += 1
                continue

            seen_hashes.add(file_hash)
            valid_paths.append(img_path)
            count += 1

        class_counts[class_name] = count

    report = {
        "class_counts": class_counts,
        "total_valid": len(valid_paths),
        "removed_corrupted": removed_corrupted,
        "removed_duplicates": removed_duplicates,
    }
    print(f"\n✅ Validation complete: {report}")
    return report


# ─── Build DataLoaders ────────────────────────────────────────────────────────

def build_dataloaders(
    raw_dir: Path | None = None,
    batch_size: int = 32,
    train_ratio: float = 0.7,
    val_ratio: float = 0.15,
    num_workers: int = 4,
) -> Tuple[DataLoader, DataLoader, DataLoader]:
    """
    Loads all images from raw_dir, applies train/val/test splits, and returns DataLoaders.

    Returns:
        (train_loader, val_loader, test_loader)
    """
    if raw_dir is None:
        raw_dir = RAW_DIR

    if not raw_dir.exists():
        raise FileNotFoundError(
            f"Dataset directory not found: {raw_dir}\n"
            "Please download datasets and place under datasets/raw/<dataset_name>/real/ and fake/"
        )

    image_paths = []
    labels = []
    image_extensions = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}

    for label_name, label_idx in LABEL_MAP.items():
        label_dir = raw_dir / label_name
        if not label_dir.exists():
            print(f"⚠️  Missing class directory: {label_dir} — skipping")
            continue
        for img_path in label_dir.rglob("*"):
            if img_path.suffix.lower() in image_extensions:
                image_paths.append(img_path)
                labels.append(label_idx)

    if not image_paths:
        raise RuntimeError(f"No images found under {raw_dir}. Check directory structure.")

    print(f"📦 Found {len(image_paths)} images total.")

    # Full dataset for splits
    full_dataset = ForensicDataset(image_paths, labels, transform=None)
    n = len(full_dataset)
    n_train = int(n * train_ratio)
    n_val = int(n * val_ratio)
    n_test = n - n_train - n_val

    train_ds, val_ds, test_ds = random_split(
        full_dataset, [n_train, n_val, n_test],
        generator=torch.Generator().manual_seed(42),
    )

    # Apply appropriate transforms per split
    train_ds.dataset.transform = TRAIN_TRANSFORMS
    val_ds.dataset.transform = VAL_TRANSFORMS
    test_ds.dataset.transform = VAL_TRANSFORMS

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True,
                              num_workers=num_workers, pin_memory=True)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False,
                            num_workers=num_workers, pin_memory=True)
    test_loader = DataLoader(test_ds, batch_size=batch_size, shuffle=False,
                             num_workers=num_workers, pin_memory=True)

    print(f"  Train: {len(train_ds)} | Val: {len(val_ds)} | Test: {len(test_ds)}")
    return train_loader, val_loader, test_loader


if __name__ == "__main__":
    # Validate raw datasets
    for ds_name in ["cifake", "synthbuster", "faceforensics"]:
        ds_path = RAW_DIR / ds_name
        if ds_path.exists():
            validate_and_clean_dataset(ds_path)
        else:
            print(f"⚠️  Dataset not found: {ds_path}")
