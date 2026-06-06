
import time
import logging
from PIL import Image
import io
import math

try:
    import torch
    from transformers import AutoImageProcessor, SwinForImageClassification
    MODEL_AVAILABLE = True
except ImportError:
    MODEL_AVAILABLE = False
    logging.warning("torch/transformers not installed. Fallback to mock.")

class InferenceService:
    _processor = None
    _model = None
    
    @classmethod
    def load_models(cls):
        if not MODEL_AVAILABLE:
            return
        if cls._model is None:
            logging.info("Loading Swin Transformer DFDC model...")
            # We use a base swin model as placeholder for the specialized one
            model_name = "microsoft/swin-tiny-patch4-window7-224"
            cls._processor = AutoImageProcessor.from_pretrained(model_name)
            cls._model = SwinForImageClassification.from_pretrained(model_name)
            cls._model.eval()

    @classmethod
    def detect_image(cls, file_bytes: bytes):
        start_time = time.time()
        
        if not MODEL_AVAILABLE or cls._model is None:
            latency = int((time.time() - start_time) * 1000)
            return {
                "authenticity_score": 0.15,
                "confidence": 0.96,
                "risk_level": "HIGH",
                "model_name": "swin-dfdc-mock",
                "model_version": "2.0",
                "latency_ms": latency
            }

        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        inputs = cls._processor(images=image, return_tensors="pt")
        
        with torch.no_grad():
            outputs = cls._model(**inputs)
            logits = outputs.logits
            probs = torch.nn.functional.softmax(logits, dim=-1)
            fake_prob = probs[0][1].item() if probs.shape[1] > 1 else 0.5
            
        # Calibration
        confidence = max(fake_prob, 1 - fake_prob)
        # Normalize authenticity_score where 1.0 is authentic, 0.0 is fake
        authenticity_score = 1.0 - fake_prob
        
        risk_level = "LOW"
        if authenticity_score < 0.4:
            risk_level = "HIGH"
        elif authenticity_score < 0.7:
            risk_level = "MEDIUM"
            
        latency = int((time.time() - start_time) * 1000)
        
        return {
            "authenticity_score": authenticity_score,
            "confidence": confidence,
            "risk_level": risk_level,
            "model_metadata": {
                "name": "swin-dfdc-v1",
                "version": "1.0",
                "framework": "pytorch"
            },
            "latency_ms": latency
        }
