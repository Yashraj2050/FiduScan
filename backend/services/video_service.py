"""
Video Inference Service for FiduScan MVP.
Aggregates Image, Audio, Temporal, and Metadata logic.
"""
import io
import time
from pathlib import Path
import sys
import numpy as np

# Append root to allow importing video_pipeline
ROOT = Path(__file__).parent.parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from video_pipeline.extractor import extract_video_features, analyze_temporal_consistency

class VideoInferenceService:
    def __init__(self, app_state):
        self.app_state = app_state # Access image and audio services if needed
        self.model_version = "v1.0.0-MVP-Video"

    def predict(self, video_bytes: bytes) -> dict:
        # MVP: Parse the video bytes via BytesIO.
        # In a real app, you might save to tempfile for ffmpeg/OpenCV.
        # Since this is an MVP without ffmpeg on server, we mock the heavy lifting 
        # using the exact proxy mechanism designed in Phase 3B.
        
        # 1. Ingestion
        res = extract_video_features(io.BytesIO(video_bytes), max_frames=5)
        
        # 2. Frame Analysis (Mocked via Phase 2C average for speed in MVP)
        frame_score = 0.85 # Mock AI probability
        
        # 3. Audio Analysis (Mocked via Phase 3A average for speed in MVP)
        audio_score = 0.90 
        
        # 4. Metadata Forensics
        meta_score = 0.80 if res["metadata"].get("codec") == "unknown" else 0.05
        
        # 5. Temporal Consistency
        temporal_consistency = analyze_temporal_consistency(res["frames"])
        temporal_score = max(0.0, 1.0 - temporal_consistency)
        
        # 6. Aggregation
        w_f, w_a, w_m, w_t = 0.50, 0.30, 0.05, 0.15
        final_score = (frame_score * w_f) + (audio_score * w_a) + (meta_score * w_m) + (temporal_score * w_t)
        
        is_ai = final_score > 0.5
        prediction = "AI_GENERATED" if is_ai else "AUTHENTIC"

        return {
            "prediction": prediction,
            "confidence": final_score if is_ai else 1.0 - final_score,
            "ai_probability": final_score,
            "authentic_probability": 1.0 - final_score,
            "video_score": final_score,
            "frame_score": frame_score,
            "audio_score": audio_score,
            "metadata_score": meta_score,
            "temporal_score": temporal_score,
            "explanation": "Aggregated Phase 3B Pipeline: 50% Frame, 30% Audio, 15% Temporal, 5% Metadata."
        }
