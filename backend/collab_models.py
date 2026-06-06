
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
import enum
from database import Base
from datetime import datetime

class ResourceType(str, enum.Enum):
    CASE = "case"
    EVIDENCE = "evidence"
    REPORT = "report"

class Comment(Base):
    __tablename__ = "comments"
    id = Column(String, primary_key=True)
    author_id = Column(String, ForeignKey("users.id"))
    resource_type = Column(Enum(ResourceType))
    resource_id = Column(String)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(String, primary_key=True)
    resource_type = Column(Enum(ResourceType))
    resource_id = Column(String)
    assignee_id = Column(String, ForeignKey("users.id"))
    assigner_id = Column(String, ForeignKey("users.id"))
    due_date = Column(DateTime)
    status = Column(String, default="pending")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    type = Column(String) # mention, assignment, system
    message = Column(String)
    read = Column(String, default="false")
    created_at = Column(DateTime, default=datetime.utcnow)
