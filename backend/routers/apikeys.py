"""
API Keys router — handles generation, listing, and revocation of Developer API Keys.
"""
import uuid
import secrets
import hashlib
from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel

from database import get_db
from auth import get_current_user
from models import User, DeveloperApiKey

router = APIRouter()

# ─── Schemas ─────────────────────────────────────────────────────────────

class ApiKeyCreateRequest(BaseModel):
    name: str

class ApiKeyCreateResponse(BaseModel):
    id: str
    name: str
    api_key: str  # Plaintext key, returned ONLY once
    created_at: datetime

class ApiKeyResponse(BaseModel):
    id: str
    name: str
    created_at: datetime
    last_used_at: Optional[datetime]
    revoked: bool

# ─── Endpoints ─────────────────────────────────────────────────────────────

def hash_key(key: str) -> str:
    return hashlib.sha256(key.encode()).hexdigest()

@router.post("/api-keys", response_model=ApiKeyCreateResponse)
def create_api_key(
    request_data: ApiKeyCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    key_id = f"key_{uuid.uuid4().hex[:16]}"
    # Generate secure random key
    raw_key = f"fs_{secrets.token_urlsafe(32)}"
    
    # Hash it for storage
    hashed = hash_key(raw_key)
    
    db_key = DeveloperApiKey(
        id=key_id,
        user_id=current_user.user_id,
        key_hash=hashed,
        name=request_data.name,
        revoked=0
    )
    
    db.add(db_key)
    db.commit()
    db.refresh(db_key)
    
    return ApiKeyCreateResponse(
        id=db_key.id,
        name=db_key.name,
        api_key=raw_key,
        created_at=db_key.created_at
    )

@router.get("/api-keys", response_model=List[ApiKeyResponse])
def list_api_keys(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    keys = (
        db.query(DeveloperApiKey)
        .filter(DeveloperApiKey.user_id == current_user.user_id)
        .order_by(desc(DeveloperApiKey.created_at))
        .all()
    )
    
    return [
        ApiKeyResponse(
            id=k.id,
            name=k.name,
            created_at=k.created_at,
            last_used_at=k.last_used_at,
            revoked=bool(k.revoked)
        )
        for k in keys
    ]

@router.delete("/api-keys/{key_id}", status_code=204)
def revoke_api_key(
    key_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_key = (
        db.query(DeveloperApiKey)
        .filter(DeveloperApiKey.id == key_id)
        .filter(DeveloperApiKey.user_id == current_user.user_id)
        .first()
    )
    
    if not db_key:
        raise HTTPException(status_code=404, detail="API Key not found")
        
    if db_key.revoked:
        raise HTTPException(status_code=400, detail="API Key already revoked")
        
    db_key.revoked = 1
    db.commit()
    
    return None
