from fastapi import FastAPI
from fastapi.testclient import TestClient
from backend.evidence_chain import router

app = FastAPI()
app.include_router(router)
client = TestClient(app)

def test_create_evidence():
    response = client.post("/evidence/", json={
        "case_id": 1,
        "file_hash": "hash_xyz",
        "report_hash": "rep_xyz",
        "authenticity_score": 0.99
    })
    assert response.status_code == 200
    assert response.json()["status"] == "created"

def test_retrieve_evidence():
    response = client.get("/evidence/1")
    assert response.status_code == 200
    assert "file_hash" in response.json()

def test_verify_evidence_success():
    response = client.post("/evidence/1/verify", json={
        "file_hash": "mock_hash_123",
        "report_hash": "mock_report_456"
    })
    assert response.status_code == 200
    assert response.json()["verified"] == True

def test_verify_evidence_failure():
    response = client.post("/evidence/1/verify", json={
        "file_hash": "tampered_hash",
        "report_hash": "mock_report_456"
    })
    assert response.status_code == 200
    assert response.json()["verified"] == False

def test_retrieve_custody():
    response = client.get("/evidence/1/custody")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
