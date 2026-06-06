
import time
import logging
from PIL import Image
import io

try:
    import torch
    from transformers import ViTForImageClassification, ViTImageProcessor
    MODEL_AVAILABLE = True
except ImportError:
    MODEL_AVAILABLE = False
    logging.warning("torch/transformers not installed. Image detection will use mock fallback.")

class InferenceService:
    _image_processor = None
    _image_model = None
    
    @classmethod
    def load_models(cls):
        if not MODEL_AVAILABLE:
            return
        if cls._image_model is None:
            logging.info("Loading ViT image model...")
            model_name = "google/vit-base-patch16-224"
            cls._image_processor = ViTImageProcessor.from_pretrained(model_name)
            cls._image_model = ViTForImageClassification.from_pretrained(model_name)
            cls._image_model.eval()
            logging.info("ViT image model loaded.")

    @classmethod
    def detect_image(cls, file_bytes: bytes):
        start_time = time.time()
        
        if not MODEL_AVAILABLE or cls._image_model is None:
            # Fallback for testing environments where torch is not installed
            latency_ms = int((time.time() - start_time) * 1000)
            return {
                "fake_probability": 0.85,
                "confidence": 0.95,
                "model_metadata": {"name": "vit-base-mock", "version": "1.0"},
                "latency_ms": latency_ms
            }

        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        inputs = cls._image_processor(images=image, return_tensors="pt")
        
        with torch.no_grad():
            outputs = cls._image_model(**inputs)
            logits = outputs.logits
            probs = torch.nn.functional.softmax(logits, dim=-1)
            # Assuming binary classification where class 1 is "fake"
            fake_prob = probs[0][1].item() if probs.shape[1] > 1 else 0.5
            
        latency_ms = int((time.time() - start_time) * 1000)
        
        return {
            "fake_probability": fake_prob,
            "confidence": max(fake_prob, 1 - fake_prob),
            "model_metadata": {
                "name": "google/vit-base-patch16-224",
                "version": "1.0",
                "framework": "pytorch"
            },
            "latency_ms": latency_ms
        }
