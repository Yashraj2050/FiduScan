"""
Enterprise Audit Logging Models — FiduScan v6.5
Immutable, cryptographically chained audit logs for compliance.
"""

from sqlalchemy import (
    Column, String, Integer, DateTime,
    ForeignKey, JSON, Text, Enum
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from database import Base


class RetentionPolicy(str, enum.Enum):
    DAYS_30 = "30_days"
    DAYS_90 = "90_days"
    YEAR_1 = "1_year"
    UNLIMITED = "unlimited"


class EventType(str, enum.Enum):
    SECURITY = "security"
    AUTH = "auth"
    SYSTEM = "system"
    DATA = "data"
    CONFIG = "config"


class EnterpriseAuditLog(Base):
    """
    Advanced append-only audit log with cryptographic chaining.
    """
    __tablename__ = "enterprise_audit_logs"

    id             = Column(String, primary_key=True, index=True)
    org_id         = Column(String, ForeignKey("organizations.org_id"), nullable=False, index=True)
    user_id        = Column(String, ForeignKey("users.user_id"), nullable=True, index=True)
    
    event_type     = Column(String, nullable=False, index=True)      # SECURITY, AUTH, DATA, CONFIG
    resource_type  = Column(String, nullable=True)                   # 'evidence', 'report', 'api_key', 'webhook'
    resource_id    = Column(String, nullable=True)                   # specific resource modified
    action         = Column(String, nullable=False, index=True)      # e.g., 'login', 'report_download'
    
    ip_address     = Column(String, nullable=True)
    user_agent     = Column(String, nullable=True)
    metadata_json  = Column(JSON, nullable=True)
    
    created_at     = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # ── Tamper Detection (Chained Hashing) ─────────────────────────
    previous_hash  = Column(String, nullable=False)
    log_hash       = Column(String, nullable=False, unique=True)


class OrgAuditConfig(Base):
    """
    Stores the retention policy for an organization.
    """
    __tablename__ = "org_audit_configs"
    
    org_id           = Column(String, ForeignKey("organizations.org_id"), primary_key=True)
    retention_policy = Column(String, default=RetentionPolicy.UNLIMITED.value)
    last_purged_at   = Column(DateTime(timezone=True), nullable=True)
    
    organization = relationship("Organization")
