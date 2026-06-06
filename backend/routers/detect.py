
from fastapi import APIRouter, UploadFile, File
from services.inference_service import InferenceService

router = APIRouter()

# Ensure model is loaded on startup
InferenceService.load_models()

@router.post("/image")
async def detect_image(file: UploadFile = File(...)):
    content = await file.read()
    result = InferenceService.detect_image(content)
    
    # In a real system, this integrates with evidence chain and reports
    # evidence_id = EvidenceService.create_evidence(file.filename, content)
    # report = ReportService.generate_report(evidence_id, result)
    
    return result
