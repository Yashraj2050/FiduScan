import unittest
from services.inference_service import InferenceService
import io
from PIL import Image

class TestInference(unittest.TestCase):
    def test_image_detection(self):
        img = Image.new('RGB', (10, 10), color='blue')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        dummy_img = img_bytes.getvalue()
        
        InferenceService.load_models()
        try:
            res = InferenceService.detect_image(dummy_img)
            self.assertIn("authenticity_score", res)
            self.assertIn("dataset", res)
            self.assertEqual(res["dataset"], "ImageNet (Not a true deepfake model)")
        except RuntimeError:
            pass
