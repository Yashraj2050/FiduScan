from fastapi import APIRouter, File, UploadFile
from backend.audio_watermark import SpreadSpectrumAudioWatermark
from backend.routers.watermark import VerificationResponse
from backend.reports import ReportGenerator

router = APIRouter()
engine = SpreadSpectrumAudioWatermark()
report_gen = ReportGenerator()

@router.post("/detect", response_model=VerificationResponse)
async def detect_audio_watermark(file: UploadFile = File(...)):
    content = await file.read()
    payload = engine.extract_watermark(content)
    
    if payload:
        is_valid = engine.verify_watermark(payload)
        metrics = engine.generate_authenticity_metrics(is_valid)
        
        # Report integration
        report_data = {
            "scan_id": "scan_audio_123",
            "watermark_status": "VALID" if is_valid else "CORRUPTED",
            "watermark_id": payload.get("watermark_id"),
            "authenticity_score": metrics["authenticity_score"],
            "verification_confidence": metrics["verification_confidence"],
        }
        report = report_gen.generate_json_report(report_data)
        
        return VerificationResponse(
            watermark_present=True,
            watermark_id=payload.get("watermark_id"),
            timestamp=payload.get("timestamp"),
            version=payload.get("version"),
            integrity_status="VALID" if is_valid else "CORRUPTED",
            authenticity_score=metrics["authenticity_score"],
            verification_confidence=metrics["verification_confidence"]
        )
    else:
        return VerificationResponse(
            watermark_present=False,
            integrity_status="MISSING",
            authenticity_score=0.0,
            verification_confidence=0.98
        )
