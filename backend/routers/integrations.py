
from fastapi import APIRouter

router = APIRouter()

@router.post("/slack")
def connect_slack():
    return {"status": "connected"}

@router.post("/teams")
def connect_teams():
    return {"status": "connected"}

@router.post("/{integration_id}/test")
def test_notification(integration_id: str):
    return {"status": "sent"}

@router.put("/preferences")
def update_preferences():
    return {"status": "updated"}
