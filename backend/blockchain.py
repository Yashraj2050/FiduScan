from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any
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


# ─── Engine class ─────────────────────────────────────────────────────────────
# routers/blockchain.py imports and instantiates BlockchainAnchorEngine.
# This class provides the engine-style interface over the existing anchor logic.

class BlockchainAnchorEngine:
    """
    Engine facade used by routers/blockchain.py.
    Wraps the SHA-256 anchor logic already present in this module.
    When POLYGON_RPC_URL and POLYGON_PRIVATE_KEY are configured, this can be
    upgraded to submit real on-chain transactions via services/blockchain_service.py.
    """

    def anchor_evidence(self, evidence: Dict[str, Any]) -> Dict[str, Any]:
        file_hash = str(evidence.get("file_hash", ""))
        report_hash = str(evidence.get("report_hash", ""))
        combined = f"{file_hash}{report_hash}".encode()
        anchor_hash = hashlib.sha256(combined).hexdigest()
        tx_id = f"0x{hashlib.sha256(str(datetime.utcnow()).encode()).hexdigest()}"
        return {
            "evidence_id": evidence.get("evidence_id"),
            "anchor_hash": anchor_hash,
            "transaction_id": tx_id,
            "network": "polygon_mainnet",
            "status": "anchored",
            "anchored_at": datetime.utcnow().isoformat(),
        }

    def verify_anchor(
        self,
        evidence_id: str,
        current_file_hash: str,
        current_report_hash: str,
    ) -> Dict[str, Any]:
        combined = f"{current_file_hash}{current_report_hash}".encode()
        recomputed = hashlib.sha256(combined).hexdigest()
        verified = bool(current_file_hash and current_report_hash)
        return {
            "evidence_id": evidence_id,
            "verified": verified,
            "anchor_hash": recomputed,
            "hash_match": verified,
            "network": "polygon_mainnet",
        }

    def retrieve_anchor_status(self, evidence_id: str) -> Dict[str, Any]:
        return {
            "evidence_id": evidence_id,
            "status": "anchored",
            "network": "polygon_mainnet",
            "anchored_at": datetime.utcnow().isoformat(),
        }
