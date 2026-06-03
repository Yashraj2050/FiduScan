from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from backend.reports import ReportGenerator

router = APIRouter()
generator = ReportGenerator()

class ReportRequest(BaseModel):
    data: Dict[str, Any]

class VerifyRequest(BaseModel):
    report: Dict[str, Any]

@router.post("/generate")
async def generate_report(req: ReportRequest):
    return generator.generate_json_report(req.data)

@router.get("/download/{report_id}")
async def download_report(report_id: str):
    # Mocking download
    return {"status": "success", "file": f"{report_id}.pdf"}

@router.post("/verify")
async def verify_report(req: VerifyRequest):
    is_valid = generator.verify_report(req.report)
    return {"valid": is_valid}
