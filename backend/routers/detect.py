
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.inference_service import InferenceService
import logging

router = APIRouter()
InferenceService.load_models()

@router.post("/image")
async def detect_image(file: UploadFile = File(...)):
    content = await file.read()
    try:
        result = InferenceService.detect_image(content)
        
        # Integration with Reports, Evidence, and Audit
        # ReportService.append_authenticity_data(result)
        # EvidenceService.store_prediction(result)
        # AuditLogger.log_event("inference_executed", result)
        
        return result
    except RuntimeError as e:
        logging.error(str(e))
        raise HTTPException(status_code=503, detail=str(e))
