
from fastapi import APIRouter, UploadFile, File
from services.inference_service import InferenceService

router = APIRouter()
InferenceService.load_models()

@router.post("/image")
async def detect_image(file: UploadFile = File(...)):
    content = await file.read()
    result = InferenceService.detect_image(content)
    # Integrate with reports and evidence
    return result
