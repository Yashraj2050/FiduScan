
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum, Boolean, JSON
import enum
from database import Base
from datetime import datetime

class IntegrationType(str, enum.Enum):
    SLACK = "slack"
    TEAMS = "teams"

class OrganizationIntegration(Base):
    __tablename__ = "organization_integrations"
    id = Column(String, primary_key=True)
    org_id = Column(String, ForeignKey("organizations.id"))
    integration_type = Column(Enum(IntegrationType))
    workspace_id = Column(String) # tenant or workspace
    webhook_url = Column(String)
    channel_id = Column(String)
    config = Column(JSON, default=dict)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserNotificationPreference(Base):
    __tablename__ = "user_notification_preferences"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    preferences = Column(JSON, default=dict) # e.g. {"evidence_created": True, "mentions": True}
