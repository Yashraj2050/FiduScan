import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_detect_valid_audio_watermark():
    files = {"file": ("test.mp3", b"AUDIO_WM_SS_fake_audio", "audio/mpeg")}
    response = client.post("/api/v1/audio_watermark/detect", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["watermark_present"] == True
    assert data["integrity_status"] == "VALID"
    assert data["authenticity_score"] == 99.5

def test_detect_missing_audio_watermark():
    files = {"file": ("test.wav", b"fake_audio", "audio/wav")}
    response = client.post("/api/v1/audio_watermark/detect", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["watermark_present"] == False
    assert data["integrity_status"] == "MISSING"

def test_detect_compressed_audio_watermark():
    files = {"file": ("test.m4a", b"AUDIO_WM_SS_compressed_audio", "audio/m4a")}
    response = client.post("/api/v1/audio_watermark/detect", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["watermark_present"] == True

def test_detect_corrupted_audio_watermark():
    pass
