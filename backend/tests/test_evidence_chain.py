import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_create_and_verify_evidence():
    data = {
        "file_hash": "hash_123",
        "report_hash": "rep_hash_123",
        "watermark_id": "wm_123",
        "user_id": "user_123",
        "authenticity_score": 99.0
    }
    
    # Create evidence
    response = client.post("/api/v1/evidence/create", json={"data": data})
    assert response.status_code == 200
    record = response.json()
    assert "evidence_id" in record
    record_id = record["evidence_id"]
    
    # Verify valid evidence
    response = client.post("/api/v1/evidence/verify", json={
        "record_id": record_id,
        "current_file_hash": "hash_123",
        "current_report_hash": "rep_hash_123"
    })
    assert response.status_code == 200
    assert response.json()["valid"] == True
    
    # Verify tampered evidence
    response = client.post("/api/v1/evidence/verify", json={
        "record_id": record_id,
        "current_file_hash": "hash_tampered",
        "current_report_hash": "rep_hash_123"
    })
    assert response.status_code == 200
    assert response.json()["valid"] == False
    
    # Check history
    response = client.get(f"/api/v1/evidence/history/{record_id}")
    assert response.status_code == 200
    history = response.json()["history"]
    assert len(history) >= 2 # created + verified
