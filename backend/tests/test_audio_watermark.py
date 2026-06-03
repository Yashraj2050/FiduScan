from fastapi.testclient import TestClient
from backend.audio_watermark import router

client = TestClient(router)

def test_embed_audio_watermark():
    response = client.post("/embed", json={
        "file_hash": "test_hash_1",
        "payload": "fiduscan_auth_123"
    })
    assert response.status_code == 200
    assert response.json()["status"] == "embedded"
    assert response.json()["file_hash"] == "test_hash_1"

def test_verify_audio_watermark_success():
    response = client.post("/verify", json={
        "file_hash": "valid_audio_hash"
    })
    assert response.status_code == 200
    assert response.json()["verified"] == True
    assert response.json()["payload"] == "fiduscan_auth_123"

def test_verify_audio_watermark_failure():
    response = client.post("/verify", json={
        "file_hash": "invalid_audio_hash"
    })
    assert response.status_code == 200
    assert response.json()["verified"] == False
    assert response.json()["payload"] is None
