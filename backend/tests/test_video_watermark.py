import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_detect_valid_video_watermark():
    files = {"file": ("test.mp4", b"VIDEO_WM_ST_fake_video", "video/mp4")}
    response = client.post("/api/v1/video_watermark/detect", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["watermark_present"] == True
    assert data["integrity_status"] == "VALID"
    assert "verified_frames_percent" in data["frame_integrity"]
    assert "temporal_authenticity_score" in data["temporal_consistency"]
    assert data["authenticity_score"] == 99.0

def test_detect_missing_video_watermark():
    files = {"file": ("test.mov", b"fake_video", "video/quicktime")}
    response = client.post("/api/v1/video_watermark/detect", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["watermark_present"] == False
    assert data["integrity_status"] == "MISSING"

def test_detect_compressed_video_watermark():
    files = {"file": ("test.webm", b"VIDEO_WM_ST_compressed_video", "video/webm")}
    response = client.post("/api/v1/video_watermark/detect", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["watermark_present"] == True

def test_detect_edited_video_watermark():
    pass

def test_detect_corrupted_video_watermark():
    pass
