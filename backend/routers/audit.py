"""
Enterprise Audit Logging Router — FiduScan v6.5
Exposes search, export, verification, and settings.
"""

from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import User, OrganizationMember
from auth import get_current_user
from audit_models import EnterpriseAuditLog, OrgAuditConfig, RetentionPolicy
from audit_service import AuditQueryService, AuditLogger, AuditRetentionService

router = APIRouter()


class AuditLogResponse(BaseModel):
    id: str
    org_id: str
    user_id: Optional[str]
    event_type: str
    resource_type: Optional[str]
    resource_id: Optional[str]
    action: str
    ip_address: Optional[str]
    user_agent: Optional[str]
    metadata_json: Optional[dict]
    created_at: datetime
    previous_hash: str
    log_hash: str

    class Config:
        from_attributes = True


class AuditLogListResponse(BaseModel):
    total: int
    logs: List[AuditLogResponse]


class AuditVerificationResponse(BaseModel):
    is_valid: bool
    message: str


class RetentionPolicyRequest(BaseModel):
    policy: RetentionPolicy


def _assert_org_admin_or_auditor(user: User, org_id: str, db: Session):
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.org_id == org_id,
        OrganizationMember.user_id == user.user_id,
    ).first()
    if not membership or membership.role not in ("Owner", "Admin", "Auditor"):
        raise HTTPException(
            status_code=403, 
            detail="Requires Admin or Auditor privileges to access audit logs"
        )


@router.get("/orgs/{org_id}/audit-logs", response_model=AuditLogListResponse)
def get_audit_logs(
    org_id: str,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    user_id: Optional[str] = None,
    action: Optional[str] = None,
    resource_type: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    _assert_org_admin_or_auditor(current_user, org_id, db)
    
    logs, total = AuditQueryService.get_logs(
        db=db, org_id=org_id, start_date=start_date, end_date=end_date,
        user_id=user_id, action=action, resource_type=resource_type,
        limit=limit, offset=offset
    )
    return {"total": total, "logs": logs}


@router.get("/orgs/{org_id}/audit-logs/export")
def export_audit_logs(
    org_id: str,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    format: str = Query("csv", regex="^(csv|json)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    _assert_org_admin_or_auditor(current_user, org_id, db)
    
    # Export up to 10k logs at once
    logs, _ = AuditQueryService.get_logs(
        db=db, org_id=org_id, start_date=start_date, end_date=end_date,
        limit=10000, offset=0
    )
    
    if format == "csv":
        csv_data = AuditQueryService.export_csv(logs)
        return Response(
            content=csv_data, 
            media_type="text/csv", 
            headers={"Content-Disposition": f"attachment; filename=audit_logs_{org_id}.csv"}
        )
    else:
        # json export
        return logs


@router.post("/orgs/{org_id}/audit-logs/verify", response_model=AuditVerificationResponse)
def verify_audit_chain(
    org_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cryptographically verify the integrity of the audit ledger."""
    _assert_org_admin_or_auditor(current_user, org_id, db)
    
    is_valid, message = AuditLogger.verify_chain(db, org_id)
    return {"is_valid": is_valid, "message": message}


@router.put("/orgs/{org_id}/audit-settings/retention")
def update_retention_policy(
    org_id: str,
    req: RetentionPolicyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update log retention policy and trigger a purge."""
    _assert_org_admin_or_auditor(current_user, org_id, db)
    
    config = db.query(OrgAuditConfig).filter(OrgAuditConfig.org_id == org_id).first()
    if not config:
        config = OrgAuditConfig(org_id=org_id)
        db.add(config)
        
    config.retention_policy = req.policy.value
    db.commit()
    
    # Trigger purge based on new policy
    deleted = AuditRetentionService.enforce_retention_policy(db, org_id)
    
    # Log the policy change
    from audit_models import EventType
    AuditLogger.log_event(
        db=db,
        org_id=org_id,
        user_id=current_user.user_id,
        event_type=EventType.CONFIG,
        action="retention_policy_updated",
        metadata={"new_policy": req.policy.value, "logs_purged": deleted}
    )
    db.commit()
    
    return {"message": "Policy updated", "logs_purged": deleted}
