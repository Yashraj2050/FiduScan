from fastapi.testclient import TestClient
from backend.review_workflow import router

client = TestClient(router)

def test_create_review():
    response = client.post("/", json={"case_id": 1})
    assert response.status_code == 200
    assert response.json()["status"] == "pending"

def test_assign_reviewer():
    response = client.post("/1/assign", json={"reviewer_id": "user_456"})
    assert response.status_code == 200
    assert response.json()["reviewer_id"] == "user_456"
    assert response.json()["status"] == "in_review"

def test_submit_review():
    response = client.post("/1/submit", json={"comments": "Looks good", "decision": "approve"})
    assert response.status_code == 200
    assert response.json()["status"] == "approved"

def test_approve_case():
    response = client.post("/1/approve")
    assert response.status_code == 200
    assert response.json()["status"] == "approved"

def test_reject_case():
    response = client.post("/1/reject")
    assert response.status_code == 200
    assert response.json()["status"] == "rejected"

def test_list_reviews():
    response = client.get("/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
