from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="User")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    scans = relationship("Scan", back_populates="owner")
    logs = relationship("AuditLog", back_populates="user")


class Scan(Base):
    __tablename__ = "scans"

    scan_id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    modality = Column(String, nullable=False) # 'IMAGE', 'AUDIO', 'VIDEO'
    filename = Column(String, nullable=False)
    prediction = Column(String, nullable=False)
    confidence = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="scans")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    log_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    action = Column(String, nullable=False) # LOGIN_SUCCESS, INFERENCE_IMAGE
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    metadata_json = Column(JSON, nullable=True)

    user = relationship("User", back_populates="logs")

class Organization(Base):
    __tablename__ = "organizations"
    org_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    members = relationship("OrganizationMember", back_populates="organization")
    workspaces = relationship("Workspace", back_populates="organization")

class OrganizationMember(Base):
    __tablename__ = "organization_members"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    org_id = Column(String, ForeignKey("organizations.org_id"))
    user_id = Column(String, ForeignKey("users.user_id"))
    role = Column(String, nullable=False) # Owner, Admin, Analyst, Viewer

    organization = relationship("Organization", back_populates="members")
    user = relationship("User")

class Workspace(Base):
    __tablename__ = "workspaces"
    workspace_id = Column(String, primary_key=True, index=True)
    org_id = Column(String, ForeignKey("organizations.org_id"))
    name = Column(String, nullable=False)
    
    organization = relationship("Organization", back_populates="workspaces")
    api_keys = relationship("ApiKey", back_populates="workspace")

class ApiKey(Base):
    __tablename__ = "api_keys"
    key_id = Column(String, primary_key=True, index=True)
    workspace_id = Column(String, ForeignKey("workspaces.workspace_id"))
    key_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    is_active = Column(Integer, default=1)
    
    workspace = relationship("Workspace", back_populates="api_keys")

class Subscription(Base):
    __tablename__ = "subscriptions"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    stripe_customer_id = Column(String, nullable=False)
    stripe_subscription_id = Column(String, nullable=False)
    plan = Column(String, nullable=False) # FREE, PRO, ENTERPRISE
    status = Column(String, nullable=False) # active, past_due, canceled
    current_period_end = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(String, primary_key=True, index=True)
    subscription_id = Column(String, ForeignKey("subscriptions.id"))
    amount = Column(Integer, nullable=False)
    status = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class BillingEvent(Base):
    __tablename__ = "billing_events"
    id = Column(String, primary_key=True, index=True)
    event_type = Column(String, nullable=False)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UsageTracking(Base):
    __tablename__ = "usage_tracking"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    image_scans = Column(Integer, default=0)
    audio_scans = Column(Integer, default=0)
    video_scans = Column(Integer, default=0)
    api_calls = Column(Integer, default=0)
    storage_used = Column(Integer, default=0)
    reset_date = Column(DateTime(timezone=True), nullable=False)
