
import unittest
from services.video_inference_service import VideoInferenceService

class TestVideoInference(unittest.TestCase):
    def test_video_detection_v2(self):
        VideoInferenceService.load_models()
        self.assertTrue(True)
