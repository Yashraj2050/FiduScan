from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import declarative_base
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict
import hashlib

Base = declarative_base()

class Evidence(Base):
    __tablename__ = "evidence_records"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, index=True)
    file_hash = Column(String, index=True)
    report_hash = Column(String)
    watermark_id = Column(String, nullable=True)
    authenticity_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

class CustodyEvent(Base):
    __tablename__ = "custody_events"
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("evidence_records.id"))
    actor_id = Column(String)
    action = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(JSON, nullable=True)

router = APIRouter(prefix="/evidence", tags=["evidence"])

class EvidenceCreate(BaseModel):
    case_id: int
    file_hash: str
    report_hash: str
    watermark_id: Optional[str] = None
    authenticity_score: float

class VerificationRequest(BaseModel):
    file_hash: str
    report_hash: str

@router.post("/")
def create_evidence(req: EvidenceCreate):
    return {
        "id": 1,
        "case_id": req.case_id,
        "file_hash": req.file_hash,
        "report_hash": req.report_hash,
        "authenticity_score": req.authenticity_score,
        "status": "created"
    }

@router.get("/{evidence_id}")
def retrieve_evidence(evidence_id: int):
    return {
        "id": evidence_id,
        "file_hash": "mock_hash_123",
        "report_hash": "mock_report_456",
        "authenticity_score": 0.98
    }

@router.post("/{evidence_id}/verify")
def verify_evidence(evidence_id: int, req: VerificationRequest):
    # Simulated integrity check
    if req.file_hash == "mock_hash_123" and req.report_hash == "mock_report_456":
        return {"verified": True, "integrity_status": "intact"}
    return {"verified": False, "integrity_status": "tampered"}

@router.get("/{evidence_id}/custody")
def retrieve_custody_history(evidence_id: int):
    return [
        {"action": "created", "actor_id": "sys", "timestamp": str(datetime.utcnow())}
    ]
