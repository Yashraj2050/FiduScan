
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.video_inference_service import VideoInferenceService
import logging

router = APIRouter()

@router.post("/detect")
async def detect_video(file: UploadFile = File(...)):
    content = await file.read()
    try:
        result = VideoInferenceService.detect_video(content)
        return result
    except RuntimeError as e:
        logging.error(str(e))
        raise HTTPException(status_code=503, detail=str(e))
