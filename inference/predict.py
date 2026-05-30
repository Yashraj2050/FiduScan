"""
Inference pipeline — standalone prediction script.
Run directly to test model inference on a single image.

Usage:
    python inference/predict.py --image /path/to/image.jpg [--model models/efficientnet_b0_fiduscan.pth]
"""
import argparse
import io
import json
import sys
from pathlib import Path

import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))

from ai_engine.model import build_model
from security.crypto import verify_model_artifact

# ─── Preprocessing ────────────────────────────────────────────────────────────
PREPROCESS = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

LABELS = {0: "AUTHENTIC", 1: "AI_GENERATED"}
DEFAULT_MODEL_PATH = ROOT / "models" / "efficientnet_b0_fiduscan.pth"


def resolve_device() -> torch.device:
    if torch.backends.mps.is_available():
        return torch.device("mps")
    elif torch.cuda.is_available():
        return torch.device("cuda")
    return torch.device("cpu")


def load_model(model_path: Path, device: torch.device) -> torch.nn.Module:
    model = build_model(num_classes=2, pretrained=False)
    if model_path.exists():
        state = torch.load(model_path, map_location=device)
        model.load_state_dict(state)
        print(f"✅ Loaded weights from: {model_path}")
    else:
        print(f"⚠️  No trained weights at {model_path}. Using random initialization (for testing).")
    model.to(device)
    model.eval()
    return model


def predict_image(image_path: Path, model_path: Path = DEFAULT_MODEL_PATH) -> dict:
    """
    Run inference on a single image file.

    Returns:
        dict with prediction, confidence, and probabilities.
    """
    device = resolve_device()
    model = load_model(model_path, device)

    # Load and preprocess
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = PREPROCESS(image).unsqueeze(0).to(device)

    with torch.no_grad():
        logits = model(tensor)
        probs = F.softmax(logits, dim=1).squeeze(0)

    authentic_prob = probs[0].item()
    ai_prob = probs[1].item()
    pred_idx = probs.argmax().item()
    confidence = probs[pred_idx].item()

    result = {
        "image": str(image_path),
        "prediction": LABELS[pred_idx],
        "confidence": round(confidence, 6),
        "ai_probability": round(ai_prob, 6),
        "authentic_probability": round(authentic_prob, 6),
        "device": str(device),
    }

    print(json.dumps(result, indent=2))
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FiduScan Inference — Predict AI vs Authentic")
    parser.add_argument("--image", type=str, required=True, help="Path to input image")
    parser.add_argument(
        "--model", type=str, default=str(DEFAULT_MODEL_PATH),
        help="Path to trained .pth weights"
    )
    args = parser.parse_args()

    predict_image(
        image_path=Path(args.image),
        model_path=Path(args.model),
    )
