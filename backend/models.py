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
