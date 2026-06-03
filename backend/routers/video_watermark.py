from fastapi import APIRouter, File, UploadFile
from backend.video_watermark import VideoWatermarkEngine
from pydantic import BaseModel
from backend.reports import ReportGenerator
from typing import Dict

router = APIRouter()
engine = VideoWatermarkEngine()
report_gen = ReportGenerator()

class VideoVerificationResponse(BaseModel):
    watermark_present: bool
    watermark_id: str = None
    timestamp: int = None
    version: str = None
    integrity_status: str
    frame_integrity: Dict[str, float]
    temporal_consistency: Dict[str, float]
    authenticity_score: float
    verification_confidence: float

@router.post("/detect", response_model=VideoVerificationResponse)
async def detect_video_watermark(file: UploadFile = File(...)):
    content = await file.read()
    payload = engine.extract_watermark(content)
    
    if payload:
        is_valid = engine.verify_watermark(payload)
        frame_metrics = engine.analyze_frame_integrity(is_valid)
        temporal_metrics = engine.analyze_temporal_consistency(is_valid)
        metrics = engine.generate_authenticity_metrics(is_valid)
        
        # Report integration
        report_data = {
            "scan_id": "scan_video_123",
            "watermark_status": "VALID" if is_valid else "CORRUPTED",
            "watermark_id": payload.get("watermark_id"),
            "authenticity_score": metrics["overall_authenticity_score"],
            "verification_confidence": metrics["verification_confidence"],
            "detection_results": {**frame_metrics, **temporal_metrics}
        }
        report = report_gen.generate_json_report(report_data)
        
        return VideoVerificationResponse(
            watermark_present=True,
            watermark_id=payload.get("watermark_id"),
            timestamp=payload.get("timestamp"),
            version=payload.get("version"),
            integrity_status="VALID" if is_valid else "CORRUPTED",
            frame_integrity=frame_metrics,
            temporal_consistency=temporal_metrics,
            authenticity_score=metrics["overall_authenticity_score"],
            verification_confidence=metrics["verification_confidence"]
        )
    else:
        return VideoVerificationResponse(
            watermark_present=False,
            integrity_status="MISSING",
            frame_integrity=engine.analyze_frame_integrity(False),
            temporal_consistency=engine.analyze_temporal_consistency(False),
            authenticity_score=0.0,
            verification_confidence=0.99
        )
