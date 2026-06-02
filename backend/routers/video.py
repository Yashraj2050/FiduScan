"""
Video detection router — handles video upload, multimodal inference, and response.
"""
import uuid
import time
from fastapi import APIRouter, File, UploadFile, HTTPException, Request, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from utils.logger import setup_logger
from services.video_service import VideoInferenceService
from services.limits import check_usage_limit
from middleware.rate_limiter import limiter
from auth import get_current_user
from database import get_db
from models import User, Scan, AuditLog, UsageTracking

logger = setup_logger("fiduscan.video")
router = APIRouter()

class VideoDetectionResult(BaseModel):
    request_id: str
    filename: str
    prediction: str
    confidence: float
    ai_probability: float
    authentic_probability: float
    video_score: float
    frame_score: float
    audio_score: float
    metadata_score: float
    temporal_score: float
    explanation: str
    inference_time_ms: float
    model_version: str

@router.post(
    "/video/detect",
    response_model=VideoDetectionResult,
    summary="Detect AI-Generated Video (MVP)",
    description=(
        "Upload a video file (MP4, MOV, AVI, MKV). "
        "Returns aggregated multimodal score (Frames, Audio, Temporal, Metadata)."
    ),
)
@limiter.limit("10/minute")
async def detect_video(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    request_id = str(uuid.uuid4())
    start_time = time.perf_counter()

    logger.info(f"[{request_id}] Incoming video detection request — file: {file.filename}")

    # ── 0. Check Usage Limits ──────────────────────────────────────────────────
    check_usage_limit(db, current_user.user_id, "video")

    try:
        video_bytes = await file.read()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid video file upload.")

    video_svc: VideoInferenceService = request.app.state.video_service
    try:
        result = video_svc.predict(video_bytes)
    except Exception as exc:
        logger.error(f"[{request_id}] Video inference failed: {exc}", exc_info=True)
        raise HTTPException(status_code=500, detail="Video inference engine error.")

    elapsed_ms = (time.perf_counter() - start_time) * 1000

    logger.info(
        f"[{request_id}] Video Result: {result['prediction']} | "
        f"Confidence: {result['confidence']:.4f} | "
        f"Time: {elapsed_ms:.1f}ms"
    )

    scan = Scan(
        scan_id=request_id,
        user_id=current_user.user_id,
        modality="VIDEO",
        filename=file.filename,
        prediction=result["prediction"],
        confidence=f"{result['confidence']:.4f}"
    )
    db.add(scan)
    
    log = AuditLog(user_id=current_user.user_id, action="INFERENCE_VIDEO", metadata_json={"scan_id": request_id})
    db.add(log)
    
    usage = db.query(UsageTracking).filter(UsageTracking.user_id == current_user.user_id).first()
    if not usage:
        from datetime import datetime
        usage = UsageTracking(user_id=current_user.user_id, reset_date=datetime.now())
        db.add(usage)
    usage.video_scans += 1
    
    db.commit()

    return VideoDetectionResult(
        request_id=request_id,
        filename=file.filename,
        prediction=result["prediction"],
        confidence=result["confidence"],
        ai_probability=result["ai_probability"],
        authentic_probability=result["authentic_probability"],
        video_score=result["video_score"],
        frame_score=result["frame_score"],
        audio_score=result["audio_score"],
        metadata_score=result["metadata_score"],
        temporal_score=result["temporal_score"],
        explanation=result["explanation"],
        inference_time_ms=round(elapsed_ms, 2),
        model_version=video_svc.model_version,
    )
