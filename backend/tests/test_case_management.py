from fastapi.testclient import TestClient
from backend.case_management import router

client = TestClient(router)

def test_create_case():
    response = client.post("/", json={"title": "New Case", "description": "Test", "priority": "medium"})
    assert response.status_code == 200
    assert response.json()["title"] == "New Case"

def test_list_cases():
    response = client.get("/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_case():
    response = client.get("/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1

def test_update_case():
    response = client.put("/1", json={"title": "Updated", "description": "Test", "priority": "high"})
    assert response.status_code == 200
    assert response.json()["title"] == "Updated"

def test_delete_case():
    response = client.delete("/1")
    assert response.status_code == 200
    assert response.json()["success"] == True

def test_link_evidence():
    response = client.post("/1/evidence?evidence_id=ev_123")
    assert response.status_code == 200
    assert response.json()["evidence_id"] == "ev_123"

def test_link_report():
    response = client.post("/1/reports?report_id=rep_123")
    assert response.status_code == 200
    assert response.json()["report_id"] == "rep_123"
