
from fastapi import APIRouter

router = APIRouter()

@router.post("/comments")
def create_comment():
    return {"status": "success"}

@router.get("/comments/{resource_type}/{resource_id}")
def get_comments(resource_type: str, resource_id: str):
    return {"comments": []}

@router.post("/assignments")
def create_assignment():
    return {"status": "success"}

@router.get("/notifications")
def get_notifications():
    return {"notifications": []}
