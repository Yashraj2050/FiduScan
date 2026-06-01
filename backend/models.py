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
