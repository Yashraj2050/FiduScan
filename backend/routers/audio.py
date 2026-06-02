"""
Audio detection router — handles audio upload, inference, and response.
"""
import uuid
import time
from fastapi import APIRouter, File, UploadFile, HTTPException, Request, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from utils.logger import setup_logger
from services.audio_service import AudioInferenceService
from services.limits import check_usage_limit
from middleware.rate_limiter import limiter
from auth import get_current_user
from database import get_db
from models import User, Scan, AuditLog, UsageTracking

logger = setup_logger("fiduscan.audio")
router = APIRouter()

class AudioDetectionResult(BaseModel):
    request_id: str
    filename: str
    prediction: str
    confidence: float
    ai_probability: float
    authentic_probability: float
    explanation_metadata: dict
    inference_time_ms: float
    model_version: str

@router.post(
    "/audio/detect",
    response_model=AudioDetectionResult,
    summary="Detect AI-Generated Audio (MVP)",
    description=(
        "Upload an audio file (WAV, MP3, M4A). "
        "Returns binary classification (AI_GENERATED vs AUTHENTIC), "
        "confidence score, and explanation metadata."
    ),
)
@limiter.limit("10/minute")
async def detect_audio(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    request_id = str(uuid.uuid4())
    start_time = time.perf_counter()

    logger.info(f"[{request_id}] Incoming audio detection request — file: {file.filename}")

    # ── 0. Check Usage Limits ──────────────────────────────────────────────────
    check_usage_limit(db, current_user.user_id, "audio")

    try:
        audio_bytes = await file.read()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid audio file upload.")

    audio_svc: AudioInferenceService = request.app.state.audio_service
    try:
        result = audio_svc.predict(audio_bytes)
    except Exception as exc:
        logger.error(f"[{request_id}] Audio inference failed: {exc}", exc_info=True)
        raise HTTPException(status_code=500, detail="Audio inference engine error.")

    elapsed_ms = (time.perf_counter() - start_time) * 1000

    logger.info(
        f"[{request_id}] Audio Result: {result['prediction']} | "
        f"Confidence: {result['confidence']:.4f} | "
        f"Time: {elapsed_ms:.1f}ms"
    )

    scan = Scan(
        scan_id=request_id,
        user_id=current_user.user_id,
        modality="AUDIO",
        filename=file.filename,
        prediction=result["prediction"],
        confidence=f"{result['confidence']:.4f}"
    )
    db.add(scan)
    
    log = AuditLog(user_id=current_user.user_id, action="INFERENCE_AUDIO", metadata_json={"scan_id": request_id})
    db.add(log)
    
    usage = db.query(UsageTracking).filter(UsageTracking.user_id == current_user.user_id).first()
    if not usage:
        from datetime import datetime
        usage = UsageTracking(user_id=current_user.user_id, reset_date=datetime.now())
        db.add(usage)
    usage.audio_scans += 1
    
    db.commit()

    return AudioDetectionResult(
        request_id=request_id,
        filename=file.filename,
        prediction=result["prediction"],
        confidence=result["confidence"],
        ai_probability=result["ai_probability"],
        authentic_probability=result["authentic_probability"],
        explanation_metadata={"features": "Mel-Spectrogram", "note": "Explainability active."},
        inference_time_ms=round(elapsed_ms, 2),
        model_version=audio_svc.model_version,
    )
