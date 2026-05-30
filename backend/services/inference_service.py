"""
FiduScan Inference Service — with Grad-CAM explainability
Supports: EfficientNet-B0 | ResNet50 | ViT-B16
Device priority: Apple Silicon MPS → CUDA → CPU
"""
import base64
import io
import sys
import time
from pathlib import Path

import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms

ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(ROOT))

from ai_engine.model import build_model, get_model
from ai_engine.explainability import GradCAM, get_target_layer
from utils.logger import setup_logger

logger = setup_logger("fiduscan.inference_service")

# ─── Preprocessing ─────────────────────────────────────────────────────────────
PREPROCESS = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

LABELS = {0: "AUTHENTIC", 1: "AI_GENERATED"}
MODELS_DIR = ROOT / "models"
DEFAULT_MODEL = MODELS_DIR / "efficientnet_b0_fiduscan.pth"
HEATMAPS_DIR = ROOT / "outputs" / "heatmaps"


class InferenceService:
    def __init__(self, architecture: str = "efficientnet_b0"):
        self.architecture = architecture
        self.model = None
        self.grad_cam = None
        self.device = self._resolve_device()
        self.model_version = f"{architecture}-v1.0"

    @staticmethod
    def _resolve_device() -> torch.device:
        if torch.backends.mps.is_available():
            logger.info("🍎 Device: Apple Silicon MPS")
            return torch.device("mps")
        elif torch.cuda.is_available():
            logger.info(f"⚡ Device: CUDA — {torch.cuda.get_device_name(0)}")
            return torch.device("cuda")
        logger.warning("⚠️  Device: CPU")
        return torch.device("cpu")

    def load_model(self, model_path: Path | None = None):
        """Load model weights. Falls back to random init if no weights found."""
        self.model = build_model(num_classes=2)

        weights_path = model_path or DEFAULT_MODEL
        if weights_path.exists():
            logger.info(f"📂 Loading weights: {weights_path}")
            state = torch.load(weights_path, map_location=self.device)
            # Handle full checkpoint dict or plain state dict
            if isinstance(state, dict) and "model_state_dict" in state:
                state = state["model_state_dict"]
            self.model.load_state_dict(state)
            logger.info("✅ Weights loaded successfully.")
        else:
            logger.warning(
                f"⚠️  No weights at {weights_path}. Using random init. "
                "Run: python training/train.py --config training/config.yaml"
            )

        self.model.to(self.device)
        self.model.eval()

        # Initialize Grad-CAM
        target_layer = get_target_layer(self.model)
        self.grad_cam = GradCAM(self.model, target_layer)
        logger.info("🔭 Grad-CAM initialized.")

    def predict(self, image_bytes: bytes, generate_heatmap: bool = True) -> dict:
        """
        Run inference on raw image bytes.
        Optionally generates a Grad-CAM heatmap.

        Returns:
            dict: prediction, confidence, probabilities, heatmap_b64
        """
        if self.model is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")

        # Decode image
        original_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = PREPROCESS(original_image).unsqueeze(0).to(self.device)

        # Standard inference (no grad)
        with torch.no_grad():
            logits = self.model(tensor)
            probs = F.softmax(logits, dim=1).squeeze(0)

        authentic_prob = probs[0].item()
        ai_prob = probs[1].item()
        pred_idx = int(probs.argmax().item())
        confidence = float(probs[pred_idx].item())

        result = {
            "prediction": LABELS[pred_idx],
            "confidence": round(confidence, 6),
            "ai_probability": round(ai_prob, 6),
            "authentic_probability": round(authentic_prob, 6),
            "heatmap_available": False,
            "heatmap_b64": None,
        }

        # Grad-CAM (requires grad — separate forward pass)
        if generate_heatmap and self.grad_cam is not None:
            try:
                heatmap_b64 = self._generate_heatmap(image_bytes, original_image, pred_idx)
                if heatmap_b64:
                    result["heatmap_available"] = True
                    result["heatmap_b64"] = heatmap_b64
            except Exception as exc:
                logger.warning(f"Grad-CAM generation failed: {exc}")

        return result

    def _generate_heatmap(
        self, image_bytes: bytes, original_image: Image.Image, class_idx: int
    ) -> str | None:
        """Generate Grad-CAM heatmap and return as base64 PNG string."""
        HEATMAPS_DIR.mkdir(parents=True, exist_ok=True)

        # Need a fresh tensor with gradient tracking
        tensor_grad = PREPROCESS(original_image).unsqueeze(0).to(self.device)

        heatmap_pil = self.grad_cam.generate(
            image_tensor=tensor_grad,
            class_idx=class_idx,
            original_image=original_image,
        )

        # Save to disk
        ts = int(time.time())
        heatmap_path = HEATMAPS_DIR / f"heatmap_{ts}.png"
        heatmap_pil.save(heatmap_path)

        # Encode as base64
        buf = io.BytesIO()
        heatmap_pil.save(buf, format="PNG")
        b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{b64}"
