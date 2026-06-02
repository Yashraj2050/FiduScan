"""
Detection router — handles image upload, validation, inference, and response.
"""
import uuid
import time
import io
from pathlib import Path

from fastapi import APIRouter, File, UploadFile, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from utils.file_validator import validate_image_upload
from utils.logger import setup_logger
from services.inference_service import InferenceService
from services.metadata_service import extract_metadata
from services.limits import check_usage_limit
from middleware.rate_limiter import limiter
from auth import get_current_user
from database import get_db
from models import User, Scan, AuditLog, UsageTracking

logger = setup_logger("fiduscan.detect")
router = APIRouter()

# ─── Response Schema ─────────────────────────────────────────────────────────

class DetectionResult(BaseModel):
    request_id: str
    filename: str
    prediction: str           # "AI_GENERATED" | "AUTHENTIC"
    confidence: float         # 0.0 – 1.0
    ai_probability: float
    authentic_probability: float
    metadata: dict
    heatmap_available: bool
    heatmap_b64: str | None   # base64 PNG data URI if available
    inference_time_ms: float
    model_version: str


# ─── Endpoint ────────────────────────────────────────────────────────────────

@router.post(
    "/detect",
    response_model=DetectionResult,
    summary="Detect AI-Generated Image",
    description=(
        "Upload an image (JPEG, PNG, WEBP, BMP). "
        "Returns binary classification (AI_GENERATED vs AUTHENTIC), "
        "confidence score, EXIF metadata, forensic flags, and Grad-CAM heatmap."
    ),
)
@limiter.limit("10/minute")
async def detect_image(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    request_id = str(uuid.uuid4())
    start_time = time.perf_counter()
    logger.info(f"[{request_id}] Incoming detection request — file: {file.filename}")

    # ── 0. Check Usage Limits ──────────────────────────────────────────────────
    check_usage_limit(db, current_user.user_id, "image")

    # ── 1. Validate file ──────────────────────────────────────────────────────
    image_bytes = await file.read()
    validate_image_upload(file.filename, image_bytes)

    # ── 2. Extract EXIF metadata ──────────────────────────────────────────────
    try:
        metadata = extract_metadata(image_bytes, file.filename)
    except Exception as exc:
        logger.warning(f"[{request_id}] Metadata extraction failed: {exc}")
        metadata = {"error": "Metadata extraction unavailable"}

    # ── 3. Run inference ──────────────────────────────────────────────────────
    inference_svc: InferenceService = request.app.state.inference_service
    try:
        result = inference_svc.predict(image_bytes)
    except Exception as exc:
        logger.error(f"[{request_id}] Inference failed: {exc}", exc_info=True)
        raise HTTPException(status_code=500, detail="Inference engine error.")

    elapsed_ms = (time.perf_counter() - start_time) * 1000

    # ── 4. Log immutably ──────────────────────────────────────────────────────
    logger.info(
        f"[{request_id}] Result: {result['prediction']} | "
        f"Confidence: {result['confidence']:.4f} | "
        f"Time: {elapsed_ms:.1f}ms"
    )

    scan = Scan(
        scan_id=request_id,
        user_id=current_user.user_id,
        modality="IMAGE",
        filename=file.filename,
        prediction=result["prediction"],
        confidence=f"{result['confidence']:.4f}"
    )
    db.add(scan)
    
    log = AuditLog(user_id=current_user.user_id, action="INFERENCE_IMAGE", metadata_json={"scan_id": request_id})
    db.add(log)
    
    usage = db.query(UsageTracking).filter(UsageTracking.user_id == current_user.user_id).first()
    if not usage:
        from datetime import datetime
        usage = UsageTracking(user_id=current_user.user_id, reset_date=datetime.now())
        db.add(usage)
    usage.image_scans += 1
    
    db.commit()

    return DetectionResult(
        request_id=request_id,
        filename=file.filename,
        prediction=result["prediction"],
        confidence=result["confidence"],
        ai_probability=result["ai_probability"],
        authentic_probability=result["authentic_probability"],
        metadata=metadata,
        heatmap_available=result.get("heatmap_available", False),
        heatmap_b64=result.get("heatmap_b64"),
        inference_time_ms=round(elapsed_ms, 2),
        model_version=inference_svc.model_version,
    )
