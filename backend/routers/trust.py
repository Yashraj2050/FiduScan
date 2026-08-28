from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import Optional
from sqlalchemy.orm import Session
import logging

from database import get_db
from services.trust.trust_service import TrustService
from services.trust.schemas import TrustAnalysisResponse

router = APIRouter()

@router.post("/analyze", response_model=TrustAnalysisResponse)
async def analyze_trust(
    file: UploadFile = File(...),
    case_id: Optional[str] = Form(None),
    requested_action: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    try:
        content = await file.read()
        filename = file.filename or "unknown"
        
        # We pass the db session to the trust service for persistence and audit logging
        result = TrustService.analyze_evidence(
            db=db,
            file_bytes=content,
            filename=filename,
            case_id=case_id
        )
        
        return result
        
    except RuntimeError as e:
        # Expected error if InferenceService fails to load or run the model
        logging.error(f"Trust analysis inference failure: {e}")
        raise HTTPException(
            status_code=503, 
            detail=f"Inference service unavailable: {str(e)}"
        )
    except Exception as e:
        # Unexpected errors (e.g. DB connection issues, metadata crashes)
        logging.error(f"Unexpected error during trust analysis: {e}")
        raise HTTPException(
            status_code=500,
            detail="An internal error occurred during trust analysis."
        )
