from fastapi import APIRouter, File, UploadFile
from pydantic import BaseModel
from backend.watermark import DCTWatermarkEngine

router = APIRouter()
engine = DCTWatermarkEngine()

class VerificationResponse(BaseModel):
    watermark_present: bool
    watermark_id: str = None
    timestamp: int = None
    version: str = None
    integrity_status: str
    authenticity_score: float
    verification_confidence: float

@router.post("/detect", response_model=VerificationResponse)
async def detect_watermark(file: UploadFile = File(...)):
    content = await file.read()
    payload = engine.extract_watermark(content)
    
    if payload:
        is_valid = engine.verify_watermark(payload)
        return VerificationResponse(
            watermark_present=True,
            watermark_id=payload.get("watermark_id"),
            timestamp=payload.get("timestamp"),
            version=payload.get("version"),
            integrity_status="VALID" if is_valid else "CORRUPTED",
            authenticity_score=98.5 if is_valid else 10.0,
            verification_confidence=0.99
        )
    else:
        return VerificationResponse(
            watermark_present=False,
            integrity_status="MISSING",
            authenticity_score=0.0,
            verification_confidence=0.99
        )
