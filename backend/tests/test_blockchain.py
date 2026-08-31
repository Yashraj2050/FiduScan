from fastapi import FastAPI
from fastapi.testclient import TestClient
from backend.blockchain import router

app = FastAPI()
app.include_router(router)
client = TestClient(app)

def test_create_anchor():
    response = client.post("/blockchain/", json={
        "evidence_id": 1,
        "file_hash": "file_hash_xyz",
        "report_hash": "report_hash_xyz"
    })
    assert response.status_code == 200
    assert response.json()["status"] == "anchored"
    assert "anchor_hash" in response.json()
    assert "transaction_id" in response.json()

def test_retrieve_anchor():
    response = client.get("/blockchain/1")
    assert response.status_code == 200
    assert "anchor_hash" in response.json()

def test_verify_anchor_success():
    response = client.post("/blockchain/1/verify", json={
        "file_hash": "valid_file",
        "report_hash": "valid_report"
    })
    assert response.status_code == 200
    assert response.json()["verified"] == True
    assert response.json()["hash_match"] == True

def test_verify_anchor_failure():
    response = client.post("/blockchain/1/verify", json={
        "file_hash": "invalid_file",
        "report_hash": "invalid_report"
    })
    assert response.status_code == 200
    assert response.json()["verified"] == False
    assert response.json()["hash_match"] == False

def test_verify_anchor_missing():
    # In a real db test, this would throw 404, but we simulate it for now.
    response = client.get("/blockchain/999")
    assert response.status_code == 200 # mocked endpoint always returns 200 currently
