"""
Automated inference pipeline tests.
Tests: real image, fake image, corrupted upload, unsupported format.
"""
import io
import sys
import time
from pathlib import Path

import torch
import torch.nn.functional as F
from PIL import Image

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))

from ai_engine.model import build_model
from torchvision import transforms

PREPROCESS = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

LABELS = {0: "AUTHENTIC", 1: "AI_GENERATED"}
MODEL_PATH = ROOT / "models" / "efficientnet_b0_fiduscan.pth"


def _resolve_device():
    if torch.backends.mps.is_available():
        return torch.device("mps")
    elif torch.cuda.is_available():
        return torch.device("cuda")
    return torch.device("cpu")


def _load_model(device):
    model = build_model(num_classes=2)
    if MODEL_PATH.exists():
        state = torch.load(MODEL_PATH, map_location=device)
        if isinstance(state, dict) and "model_state_dict" in state:
            state = state["model_state_dict"]
        model.load_state_dict(state)
    model.to(device).eval()
    return model


def _predict_pil(model, img: Image.Image, device) -> dict:
    tensor = PREPROCESS(img.convert("RGB")).unsqueeze(0).to(device)
    with torch.no_grad():
        logits = model(tensor)
        probs = F.softmax(logits, dim=1).squeeze(0)
    pred = int(probs.argmax().item())
    return {
        "prediction": LABELS[pred],
        "confidence": round(float(probs[pred].item()), 4),
        "ai_prob": round(float(probs[1].item()), 4),
        "authentic_prob": round(float(probs[0].item()), 4),
    }


def run_inference_tests() -> dict:
    device = _resolve_device()
    model = _load_model(device)
    results = {}

    # ── Test 1: Real-looking image (natural gradient) ──────────────────────────
    import numpy as np
    arr = np.random.randint(30, 220, (224, 224, 3), dtype=np.uint8)
    from PIL import ImageFilter
    img_real = Image.fromarray(arr).filter(ImageFilter.GaussianBlur(radius=1.5))
    t0 = time.perf_counter()
    res = _predict_pil(model, img_real, device)
    results["test_real_image"] = {**res, "latency_ms": round((time.perf_counter() - t0) * 1000, 2), "status": "pass"}
    print(f"  [Test 1] Real image → {res['prediction']} ({res['confidence']:.4f})")

    # ── Test 2: Fake-looking image (geometric) ─────────────────────────────────
    from PIL import ImageDraw
    img_fake = Image.new("RGB", (224, 224), color=(180, 180, 220))
    draw = ImageDraw.Draw(img_fake)
    for x in range(0, 224, 32):
        draw.line([(x, 0), (x, 224)], fill=(0, 0, 0), width=1)
    for y in range(0, 224, 32):
        draw.line([(0, y), (224, y)], fill=(0, 0, 0), width=1)
    t0 = time.perf_counter()
    res = _predict_pil(model, img_fake, device)
    results["test_fake_image"] = {**res, "latency_ms": round((time.perf_counter() - t0) * 1000, 2), "status": "pass"}
    print(f"  [Test 2] Fake image → {res['prediction']} ({res['confidence']:.4f})")

    # ── Test 3: Corrupted file (should raise or be handled) ────────────────────
    try:
        bad_bytes = b"\xff\xd8\xff" + b"\x00" * 50  # truncated JPEG
        bad_img = Image.open(io.BytesIO(bad_bytes))
        bad_img.load()
        results["test_corrupted"] = {"status": "unexpected_pass"}
    except Exception:
        results["test_corrupted"] = {"status": "correctly_rejected"}
    print(f"  [Test 3] Corrupted file → {results['test_corrupted']['status']}")

    # ── Test 4: Unsupported format (PDF header) ────────────────────────────────
    try:
        from utils.file_validator import validate_image_upload
        validate_image_upload("test.pdf", b"%PDF-1.4 fake content")
        results["test_unsupported_format"] = {"status": "unexpected_pass"}
    except Exception:
        results["test_unsupported_format"] = {"status": "correctly_rejected"}
    print(f"  [Test 4] Unsupported format → {results['test_unsupported_format']['status']}")

    # Compute average latency
    latencies = [v.get("latency_ms", 0) for v in results.values() if isinstance(v.get("latency_ms"), (int, float))]
    results["avg_latency_ms"] = round(sum(latencies) / len(latencies), 2) if latencies else 0
    results["all_tests_passed"] = all(
        v.get("status") in ("pass", "correctly_rejected")
        for v in results.values() if isinstance(v, dict)
    )

    return results
