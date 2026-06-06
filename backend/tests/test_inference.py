
import unittest
from services.inference_service import InferenceService

class TestInference(unittest.TestCase):
    def test_image_detection(self):
        # We test the inference service logic
        # Using a dummy 1x1 image bytes
        dummy_img = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\xff\xff?\x00\x05\xfe\x02\xfe\xa75\x81\x84\x00\x00\x00\x00IEND\xaeB`\x82"
        InferenceService.load_models()
        res = InferenceService.detect_image(dummy_img)
        self.assertIn("fake_probability", res)
        self.assertIn("latency_ms", res)
        self.assertIn("model_metadata", res)
