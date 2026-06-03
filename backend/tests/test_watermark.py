import pytest
from backend.watermark import DCTWatermarkEngine

def test_watermark_embed_extract():
    engine = DCTWatermarkEngine()
    original_image = b"fake_image_data"
    payload = {"watermark_id": "test-123", "timestamp": 123456789, "version": "1.0"}
    
    watermarked = engine.embed_watermark(original_image, payload)
    assert watermarked != original_image
    
    extracted = engine.extract_watermark(watermarked)
    assert extracted is not None
    assert extracted["version"] == "1.0"

def test_watermark_verify():
    engine = DCTWatermarkEngine()
    valid_payload = {"watermark_id": "test-123", "timestamp": 123456789, "version": "1.0"}
    invalid_payload = {"watermark_id": "test-123", "timestamp": 123456789, "version": "0.1"}
    
    assert engine.verify_watermark(valid_payload) == True
    assert engine.verify_watermark(invalid_payload) == False
