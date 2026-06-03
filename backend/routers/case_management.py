from fastapi import APIRouter, Response
from backend.case_management import CaseManagementEngine
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()
engine = CaseManagementEngine()

class CreateCaseRequest(BaseModel):
    data: Dict[str, Any]

class UpdateCaseRequest(BaseModel):
    case_id: str
    data: Dict[str, Any]

class AddEvidenceRequest(BaseModel):
    case_id: str
    evidence_id: str

class AddNotesRequest(BaseModel):
    case_id: str
    note: Dict[str, Any]

class ReviewCaseRequest(BaseModel):
    case_id: str
    review_data: Dict[str, Any]

@router.post("/create")
async def create_case(req: CreateCaseRequest):
    return engine.create_case(req.data)

@router.put("/update")
async def update_case(req: UpdateCaseRequest):
    return engine.update_case(req.case_id, req.data)

@router.post("/add_evidence")
async def add_evidence(req: AddEvidenceRequest):
    return engine.add_evidence(req.case_id, req.evidence_id)

@router.post("/add_notes")
async def add_notes(req: AddNotesRequest):
    return engine.add_notes(req.case_id, req.note)

@router.post("/review")
async def review_case(req: ReviewCaseRequest):
    return engine.review_case(req.case_id, req.review_data)

@router.get("/export/{case_id}")
async def export_case(case_id: str):
    zip_data = engine.export_case(case_id)
    if zip_data:
        return Response(content=zip_data, media_type="application/zip")
    return {"error": "Case not found"}
