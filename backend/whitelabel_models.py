
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, JSON
from database import Base
from datetime import datetime

class OrgBranding(Base):
    __tablename__ = "org_branding"
    id = Column(String, primary_key=True)
    org_id = Column(String, ForeignKey("organizations.id"))
    logo_url = Column(String)
    favicon_url = Column(String)
    primary_color = Column(String)
    secondary_color = Column(String)
    typography = Column(String)
    email_sender = Column(String)
    email_template = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class OrgDomain(Base):
    __tablename__ = "org_domains"
    id = Column(String, primary_key=True)
    org_id = Column(String, ForeignKey("organizations.id"))
    domain = Column(String, unique=True)
    is_verified = Column(Boolean, default=False)
    ssl_status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
