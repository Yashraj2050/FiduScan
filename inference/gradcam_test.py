"""
Grad-CAM validation test — generates heatmaps for test images.
"""
import io
import sys
import time
from pathlib import Path

import numpy as np
import torch

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))

HEATMAPS_DIR = ROOT / "outputs" / "heatmaps"
MODEL_PATH = ROOT / "models" / "efficientnet_b0_fiduscan.pth"


def _resolve_device():
    # Note: Grad-CAM requires autograd which may not work on MPS
    # Fall back to CPU for Grad-CAM reliability
    if torch.cuda.is_available():
        return torch.device("cuda")
    return torch.device("cpu")  # CPU for reliable autograd


def run_gradcam_test() -> dict:
    from PIL import Image
    from ai_engine.model import build_model
    from ai_engine.explainability import GradCAM, get_target_layer
    from torchvision import transforms

    HEATMAPS_DIR.mkdir(parents=True, exist_ok=True)

    device = _resolve_device()
    print(f"  Grad-CAM device: {device}")

    # Load model
    model = build_model(num_classes=2)
    if MODEL_PATH.exists():
        state = torch.load(MODEL_PATH, map_location=device)
        if isinstance(state, dict) and "model_state_dict" in state:
            state = state["model_state_dict"]
        model.load_state_dict(state)
    model.to(device).eval()

    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    target_layer = get_target_layer(model)
    grad_cam = GradCAM(model, target_layer)

    results = {}

    # Test 1: Synthetic real-like image
    arr = np.random.randint(50, 200, (224, 224, 3), dtype=np.uint8)
    from PIL import ImageFilter
    test_img = Image.fromarray(arr).filter(ImageFilter.GaussianBlur(radius=1.0))

    t0 = time.perf_counter()
    try:
        tensor = preprocess(test_img).unsqueeze(0).to(device)
        heatmap = grad_cam.generate(tensor, class_idx=1, original_image=test_img)
        heatmap_path = HEATMAPS_DIR / f"test_heatmap_{int(time.time())}.png"
        heatmap.save(heatmap_path)
        elapsed = (time.perf_counter() - t0) * 1000
        results["test_real"] = {
            "status": "success",
            "heatmap_path": str(heatmap_path),
            "latency_ms": round(elapsed, 2),
        }
        print(f"  [Grad-CAM Test] Heatmap generated: {heatmap_path.name} ({elapsed:.0f}ms)")
    except Exception as e:
        results["test_real"] = {"status": "failed", "error": str(e)}
        print(f"  [Grad-CAM Test] Failed: {e}")

    return results
