
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.audio_inference_service import AudioInferenceService
import logging

router = APIRouter()
AudioInferenceService.load_models()

@router.post("/detect")
async def detect_audio(file: UploadFile = File(...)):
    content = await file.read()
    try:
        result = AudioInferenceService.detect_audio(content)
        return result
    except RuntimeError as e:
        logging.error(str(e))
        raise HTTPException(status_code=503, detail=str(e))
