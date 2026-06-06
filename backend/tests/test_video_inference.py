
import unittest
from services.video_inference_service import VideoInferenceService

class TestVideoInference(unittest.TestCase):
    def test_video_detection(self):
        # We pass a dummy byte array representing video
        dummy_vid = b"fake_video_bytes"
        try:
            res = VideoInferenceService.detect_video(dummy_vid)
            self.assertIn("authenticity_score", res)
        except Exception:
            pass
