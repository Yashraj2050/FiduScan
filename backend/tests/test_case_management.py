import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_case_lifecycle():
    # Create Case
    resp = client.post("/api/v1/cases/create", json={"data": {"title": "Test Case", "owner": "investigator_1"}})
    assert resp.status_code == 200
    case_id = resp.json()["case_id"]
    
    # Update Case
    resp = client.put("/api/v1/cases/update", json={"case_id": case_id, "data": {"status": "IN_PROGRESS"}})
    assert resp.status_code == 200
    assert resp.json()["status"] == "IN_PROGRESS"
    
    # Add Evidence
    resp = client.post("/api/v1/cases/add_evidence", json={"case_id": case_id, "evidence_id": "ev_123"})
    assert resp.status_code == 200
    assert "ev_123" in resp.json()["evidence"]
    
    # Add Notes
    resp = client.post("/api/v1/cases/add_notes", json={"case_id": case_id, "note": {"author": "analyst", "content": "Found watermark"}})
    assert resp.status_code == 200
    assert len(resp.json()["notes"]) == 1
    
    # Review Workflow
    resp = client.post("/api/v1/cases/review", json={"case_id": case_id, "review_data": {"review_status": "REVIEWED", "approval_status": "APPROVED"}})
    assert resp.status_code == 200
    assert resp.json()["approval_status"] == "APPROVED"
    
    # Export Workflow
    resp = client.get(f"/api/v1/cases/export/{case_id}")
    assert resp.status_code == 200
    assert resp.headers["content-type"] == "application/zip"
