from fastapi import APIRouter
from backend.evidence_chain import EvidenceChainEngine
from pydantic import BaseModel
from typing import Dict, Any, List

router = APIRouter()
engine = EvidenceChainEngine()

class CreateEvidenceRequest(BaseModel):
    data: Dict[str, Any]

class VerifyEvidenceRequest(BaseModel):
    record_id: str
    current_file_hash: str
    current_report_hash: str

@router.post("/create")
async def create_evidence_record(req: CreateEvidenceRequest):
    return engine.create_evidence_record(req.data)

@router.post("/verify")
async def verify_evidence(req: VerifyEvidenceRequest):
    return engine.verify_evidence(req.record_id, req.current_file_hash, req.current_report_hash)

@router.get("/history/{record_id}")
async def retrieve_evidence_history(record_id: str):
    return {"history": engine.retrieve_evidence_history(record_id)}
