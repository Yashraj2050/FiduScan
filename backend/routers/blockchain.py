from fastapi import APIRouter
from backend.blockchain import BlockchainAnchorEngine
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()
engine = BlockchainAnchorEngine()

class AnchorRequest(BaseModel):
    evidence: Dict[str, Any]

class VerifyAnchorRequest(BaseModel):
    evidence_id: str
    current_file_hash: str
    current_report_hash: str

@router.post("/anchor")
async def anchor_evidence(req: AnchorRequest):
    return engine.anchor_evidence(req.evidence)

@router.post("/verify")
async def verify_anchor(req: VerifyAnchorRequest):
    return engine.verify_anchor(req.evidence_id, req.current_file_hash, req.current_report_hash)

@router.get("/status/{evidence_id}")
async def retrieve_anchor_status(evidence_id: str):
    return engine.retrieve_anchor_status(evidence_id)
