from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Subscription, UsageTracking

PLAN_LIMITS = {
    "free": {"image": 100, "audio": 10, "video": 5, "api_calls": 100},
    "pro": {"image": 10000, "audio": 1000, "video": 500, "api_calls": 10000},
    "enterprise": {"image": 100000, "audio": 10000, "video": 5000, "api_calls": 100000}
}

def get_plan_limits(plan: str) -> dict:
    return PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])

def check_usage_limit(db: Session, user_id: str, modality: str):
    """
    Checks if the user has exceeded their allowance for the specified modality.
    modality: "image", "audio", "video", or "api_calls"
    Raises HTTP 402 if limit is exceeded.
    """
    sub = db.query(Subscription).filter(Subscription.user_id == user_id).first()
    plan = sub.plan if (sub and sub.status == 'active') else 'free'
    
    limits = get_plan_limits(plan)
    limit_cap = limits.get(modality, 0)
    
    usage = db.query(UsageTracking).filter(UsageTracking.user_id == user_id).first()
    
    if not usage:
        return # No usage yet, well under limits
    
    current_usage = 0
    if modality == "image":
        current_usage = usage.image_scans
    elif modality == "audio":
        current_usage = usage.audio_scans
    elif modality == "video":
        current_usage = usage.video_scans
    elif modality == "api_calls":
        current_usage = usage.api_calls
        
    if current_usage >= limit_cap:
        raise HTTPException(
            status_code=402, 
            detail=f"Usage limit exceeded for {modality} scans. Please upgrade your plan."
        )
