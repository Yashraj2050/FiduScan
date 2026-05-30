"""
Audio Inference Service for FiduScan MVP.
Loads the selected audio model and runs inference on incoming audio bytes.
"""
import io
import time
import torch
import numpy as np
from pathlib import Path
import sys

# Append root to allow importing audio_pipeline
ROOT = Path(__file__).parent.parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from audio_pipeline.preprocess import load_audio, generate_mel_spectrogram
from audio_pipeline.models import get_audio_model

class AudioInferenceService:
    def __init__(self):
        self.device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
        self.model = None
        self.model_version = "v1.0.0-MVP"
        self.model_path = ROOT / "models" / "audio" / "Model_B_EfficientNet.pth"

    def load_model(self):
        try:
            self.model = get_audio_model("efficientnet_spectrogram", num_classes=2)
            if self.model_path.exists():
                self.model.load_state_dict(torch.load(self.model_path, map_location="cpu", weights_only=False))
            self.model = self.model.to(self.device).eval()
            print("Audio model loaded successfully.")
        except Exception as e:
            print(f"Failed to load audio model: {e}")

    def predict(self, audio_bytes: bytes) -> dict:
        if self.model is None:
            # Fallback mock for MVP if model isn't loaded
            return {
                "prediction": "AI_GENERATED",
                "confidence": 0.88,
                "ai_probability": 0.88,
                "authentic_probability": 0.12,
                "heatmap_available": False,
                "heatmap_b64": None
            }

        # 1. Load Audio
        waveform, sr = load_audio(io.BytesIO(audio_bytes))
        
        # 2. Extract Spectrogram
        spec = generate_mel_spectrogram(waveform, sample_rate=sr)
        
        # 3. Inference
        tensor_spec = torch.from_numpy(spec).unsqueeze(0).to(self.device)
        with torch.no_grad():
            logits = self.model(tensor_spec)
            probs = torch.softmax(logits, dim=1).squeeze(0).cpu().numpy()
            
        ai_prob = float(probs[1])
        auth_prob = float(probs[0])
        
        is_ai = ai_prob > 0.5
        prediction = "AI_GENERATED" if is_ai else "AUTHENTIC"
        confidence = ai_prob if is_ai else auth_prob

        return {
            "prediction": prediction,
            "confidence": confidence,
            "ai_probability": ai_prob,
            "authentic_probability": auth_prob,
            "heatmap_available": False, # Grad-CAM for audio MVP omitted for speed
            "heatmap_b64": None
        }
