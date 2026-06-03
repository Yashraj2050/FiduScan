from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
import secrets

Base = declarative_base()

class ApiKey(Base):
    __tablename__ = "api_keys"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    key_hash = Column(String, unique=True, index=True)
    name = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Webhook(Base):
    __tablename__ = "webhooks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    url = Column(String)
    secret = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class UsageMetric(Base):
    __tablename__ = "usage_metrics"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    requests = Column(Integer, default=0)
    scans = Column(Integer, default=0)
    reports = Column(Integer, default=0)
    evidence = Column(Integer, default=0)

router = APIRouter(prefix="/developer", tags=["developer"])

class ApiKeyCreate(BaseModel):
    name: str

class WebhookCreate(BaseModel):
    url: str

@router.post("/keys")
def create_api_key(req: ApiKeyCreate):
    raw_key = secrets.token_urlsafe(32)
    return {"id": 1, "name": req.name, "key": raw_key, "is_active": True}

@router.delete("/keys/{key_id}")
def revoke_api_key(key_id: int):
    return {"success": True, "id": key_id, "is_active": False}

@router.post("/keys/{key_id}/rotate")
def rotate_api_key(key_id: int):
    raw_key = secrets.token_urlsafe(32)
    return {"id": key_id, "new_key": raw_key}

@router.get("/keys")
def list_api_keys():
    return [{"id": 1, "name": "Prod Key", "is_active": True}]

@router.get("/usage")
def get_usage():
    return {"requests": 1050, "scans": 300, "reports": 50, "evidence": 50}

@router.post("/webhooks")
def create_webhook(req: WebhookCreate):
    return {"id": 1, "url": req.url, "secret": "whsec_mock123", "is_active": True}

@router.put("/webhooks/{webhook_id}")
def update_webhook(webhook_id: int, req: WebhookCreate):
    return {"id": webhook_id, "url": req.url}

@router.delete("/webhooks/{webhook_id}")
def delete_webhook(webhook_id: int):
    return {"success": True}

@router.post("/webhooks/{webhook_id}/test")
def test_webhook(webhook_id: int):
    return {"success": True, "status_code": 200, "response": "OK"}
