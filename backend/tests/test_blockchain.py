import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_anchor_and_verify():
    evidence = {
        "evidence_id": "ev_123",
        "file_hash": "hash_abc",
        "report_hash": "hash_rep_123",
        "watermark_id": "wm_123"
    }
    
    # Anchor
    resp = client.post("/api/v1/blockchain/anchor", json={"evidence": evidence})
    assert resp.status_code == 200
    assert "tx_hash" in resp.json()
    
    # Verify valid
    resp = client.post("/api/v1/blockchain/verify", json={
        "evidence_id": "ev_123",
        "current_file_hash": "hash_abc",
        "current_report_hash": "hash_rep_123"
    })
    assert resp.status_code == 200
    assert resp.json()["valid"] == True
    
    # Verify tampered
    resp = client.post("/api/v1/blockchain/verify", json={
        "evidence_id": "ev_123",
        "current_file_hash": "hash_tampered",
        "current_report_hash": "hash_rep_123"
    })
    assert resp.status_code == 200
    assert resp.json()["valid"] == False
    
    # Status
    resp = client.get("/api/v1/blockchain/status/ev_123")
    assert resp.status_code == 200
    assert resp.json()["status"] == "CONFIRMED"
