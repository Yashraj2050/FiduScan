"""
History router — handles fetching scan history for the authenticated user.
"""
from typing import List, Optional
import math
from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import desc

from database import get_db
from auth import get_current_user
from models import User, Scan
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class HistoryScanResponse(BaseModel):
    id: str
    filename: str
    type: str # modality mapped to type
    result: str # prediction mapped to result
    confidence: float
    date: datetime # timestamp mapped to date

class HistoryPaginatedResponse(BaseModel):
    items: List[HistoryScanResponse]
    total: int
    page: int
    pages: int
    has_next: bool

@router.get("/history", response_model=HistoryPaginatedResponse)
def get_history(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    type: Optional[str] = None,
    result: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Scan).filter(Scan.user_id == current_user.user_id)

    if type and type != 'all':
        query = query.filter(Scan.modality == type.upper())
    
    if result and result != 'all':
        # Result mapping: 
        # API expects 'authentic', 'fake', 'suspicious'
        # DB has 'AUTHENTIC', 'AI_GENERATED', 'SUSPICIOUS' (if applicable)
        db_prediction = result.upper()
        if result.lower() == 'fake':
            db_prediction = 'AI_GENERATED'
        query = query.filter(Scan.prediction == db_prediction)

    # Get total count for pagination
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * limit
    scans = query.order_by(desc(Scan.timestamp)).offset(offset).limit(limit).all()

    items = []
    for scan in scans:
        # map prediction back to result
        mapped_result = scan.prediction.lower()
        if scan.prediction == 'AI_GENERATED':
            mapped_result = 'fake'

        items.append(
            HistoryScanResponse(
                id=scan.scan_id,
                filename=scan.filename,
                type=scan.modality.lower(),
                result=mapped_result,
                confidence=float(scan.confidence),
                date=scan.timestamp
            )
        )

    pages = math.ceil(total / limit)

    return HistoryPaginatedResponse(
        items=items,
        total=total,
        page=page,
        pages=pages,
        has_next=page < pages
    )
