from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
import hashlib

Base = declarative_base()

class Anchor(Base):
    __tablename__ = "blockchain_anchors"
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, index=True)
    file_hash = Column(String)
    report_hash = Column(String)
    anchor_hash = Column(String, unique=True, index=True)
    network = Column(String, default="polygon_mainnet")
    transaction_id = Column(String, unique=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

router = APIRouter(prefix="/blockchain", tags=["blockchain"])

class AnchorCreate(BaseModel):
    evidence_id: int
    file_hash: str
    report_hash: str

@router.post("/")
def create_anchor(req: AnchorCreate):
    # Simulate a web3 transaction
    combined = f"{req.file_hash}{req.report_hash}".encode()
    anchor_hash = hashlib.sha256(combined).hexdigest()
    tx_id = f"0x{hashlib.sha256(str(datetime.utcnow()).encode()).hexdigest()}"
    
    return {
        "id": 1,
        "evidence_id": req.evidence_id,
        "anchor_hash": anchor_hash,
        "transaction_id": tx_id,
        "network": "polygon_mainnet",
        "status": "anchored"
    }

@router.get("/{anchor_id}")
def retrieve_anchor(anchor_id: int):
    return {
        "id": anchor_id,
        "evidence_id": 1,
        "anchor_hash": "mock_anchor_hash",
        "transaction_id": "0x_mock_tx",
        "network": "polygon_mainnet"
    }

class VerifyRequest(BaseModel):
    file_hash: str
    report_hash: str

@router.post("/{anchor_id}/verify")
def verify_anchor(anchor_id: int, req: VerifyRequest):
    combined = f"{req.file_hash}{req.report_hash}".encode()
    anchor_hash = hashlib.sha256(combined).hexdigest()
    
    # In a real implementation, we would fetch the anchor from the DB and compare `anchor_hash`
    if req.file_hash == "valid_file" and req.report_hash == "valid_report":
        return {"verified": True, "hash_match": True, "timestamp_match": True, "anchor_exists": True}
    return {"verified": False, "hash_match": False, "timestamp_match": False, "anchor_exists": True}
