from fastapi import FastAPI
from fastapi.testclient import TestClient
from developer_portal import router

app = FastAPI()
app.include_router(router)
client = TestClient(app)

def test_create_api_key():
    response = client.post("/developer/keys", json={"name": "Test Key"})
    assert response.status_code == 200
    assert "key" in response.json()

def test_revoke_api_key():
    response = client.delete("/developer/keys/1")
    assert response.status_code == 200
    assert response.json()["is_active"] == False

def test_rotate_api_key():
    response = client.post("/developer/keys/1/rotate")
    assert response.status_code == 200
    assert "new_key" in response.json()

def test_list_api_keys():
    response = client.get("/developer/keys")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_usage():
    response = client.get("/developer/usage")
    assert response.status_code == 200
    assert "requests" in response.json()

def test_create_webhook():
    response = client.post("/developer/webhooks", json={"url": "https://example.com/webhook"})
    assert response.status_code == 200
    assert "secret" in response.json()

def test_update_webhook():
    response = client.put("/developer/webhooks/1", json={"url": "https://example.com/updated"})
    assert response.status_code == 200
    assert response.json()["url"] == "https://example.com/updated"

def test_delete_webhook():
    response = client.delete("/developer/webhooks/1")
    assert response.status_code == 200
    assert response.json()["success"] == True

def test_test_webhook():
    response = client.post("/developer/webhooks/1/test")
    assert response.status_code == 200
    assert response.json()["status_code"] == 200
