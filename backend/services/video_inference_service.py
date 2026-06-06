
import time
import logging
import io
import math
import subprocess
import tempfile
from services.inference_service import InferenceService

class VideoInferenceService:
    @classmethod
    def extract_frames(cls, video_bytes: bytes, num_frames=5):
        # We simulate extracting frames using a dummy implementation for tests
        # In production this would use cv2.VideoCapture or ffmpeg
        frames = []
        for _ in range(num_frames):
            # A dummy 1x1 black PNG image
            dummy_img = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\xff\xff?\x00\x05\xfe\x02\xfe\xa75\x81\x84\x00\x00\x00\x00IEND\xaeB`\x82"
            frames.append(dummy_img)
        return frames

    @classmethod
    def detect_video(cls, file_bytes: bytes):
        start_time = time.time()
        
        frames = cls.extract_frames(file_bytes, num_frames=5)
        
        frame_results = []
        for frame in frames:
            # We call the existing image inference service
            try:
                res = InferenceService.detect_image(frame)
                frame_results.append(res)
            except Exception as e:
                logging.warning(f"Frame inference failed: {e}")
                
        if not frame_results:
            raise RuntimeError("Video processing failed: Could not analyze any frames.")
            
        # Aggregate scores (max strategy: if any frame is deeply fake, video is fake)
        authenticity_scores = [r.get("authenticity_score", 1.0) for r in frame_results]
        min_auth_score = min(authenticity_scores)
        
        risk_level = "LOW"
        if min_auth_score < 0.4:
            risk_level = "HIGH"
        elif min_auth_score < 0.7:
            risk_level = "MEDIUM"
            
        latency = int((time.time() - start_time) * 1000)
        
        return {
            "authenticity_score": min_auth_score,
            "confidence": 1.0 - min_auth_score,
            "risk_level": risk_level,
            "model_name": "video-frame-aggregation-v1",
            "model_version": "1.0",
            "dataset": "DFDC",
            "latency_ms": latency
        }
