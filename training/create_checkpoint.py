import os
import json
import torch
import torch.nn as nn
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR
from pathlib import Path
import sys

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))
from ai_engine.model import get_model

def create_pause_checkpoints():
    models_dir = ROOT / "models" / "checkpoints"
    reports_dir = ROOT / "reports" / "checkpoints"
    models_dir.mkdir(parents=True, exist_ok=True)
    reports_dir.mkdir(parents=True, exist_ok=True)
    
    # 1. Save ViT-B16 Epoch 0 state
    arch = "vit_b16"
    device = torch.device("cpu")
    model = get_model(arch, num_classes=2, pretrained=True).to(device)
    optimizer = AdamW(model.parameters(), lr=1e-4, weight_decay=1e-4)
    scheduler = CosineAnnealingLR(optimizer, T_max=10)
    
    checkpoint_state = {
        "epoch": 0,
        "model_state_dict": model.state_dict(),
        "optimizer_state_dict": optimizer.state_dict(),
        "scheduler_state_dict": scheduler.state_dict(),
        "best_f1": 0.0,
        "train_log": [],
        "arch": arch
    }
    
    ckpt_path = models_dir / f"{arch}_checkpoint.pth"
    torch.save(checkpoint_state, ckpt_path)
    print(f"Saved {ckpt_path}")
    
    # 2. Save Benchmark progress
    progress = {
        "completed_architectures": ["efficientnet_b0", "resnet50"],
        "pending_architectures": ["vit_b16"],
        "dataset_status": "completed",
        "realworld_tests": "pending",
        "explainability": "pending"
    }
    with open(reports_dir / "benchmark_progress.json", "w") as f:
        json.dump(progress, f, indent=2)
        
if __name__ == "__main__":
    create_pause_checkpoints()
