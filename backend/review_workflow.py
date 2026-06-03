from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import enum
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List

Base = declarative_base()

class ReviewStatus(str, enum.Enum):
    PENDING = "pending"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    REJECTED = "rejected"

class ReviewDecision(str, enum.Enum):
    APPROVE = "approve"
    REJECT = "reject"
    NONE = "none"

class Review(Base):
    __tablename__ = "case_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, index=True) # Would ideally be ForeignKey("cases.id")
    reviewer_id = Column(String, nullable=True)
    status = Column(Enum(ReviewStatus), default=ReviewStatus.PENDING)
    comments = Column(Text, nullable=True)
    decision = Column(Enum(ReviewDecision), default=ReviewDecision.NONE)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    entity_id = Column(Integer)
    entity_type = Column(String)
    action = Column(String)
    actor_id = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

router = APIRouter(prefix="/reviews", tags=["reviews"])

class ReviewCreate(BaseModel):
    case_id: int

class ReviewAssign(BaseModel):
    reviewer_id: str

class ReviewSubmit(BaseModel):
    comments: str
    decision: ReviewDecision

@router.post("/")
def create_review(review: ReviewCreate):
    return {"id": 1, "case_id": review.case_id, "status": ReviewStatus.PENDING}

@router.post("/{review_id}/assign")
def assign_reviewer(review_id: int, assignment: ReviewAssign):
    return {"id": review_id, "reviewer_id": assignment.reviewer_id, "status": ReviewStatus.IN_REVIEW}

@router.post("/{review_id}/submit")
def submit_review(review_id: int, submission: ReviewSubmit):
    status = ReviewStatus.APPROVED if submission.decision == ReviewDecision.APPROVE else ReviewStatus.REJECTED
    return {"id": review_id, "status": status, "decision": submission.decision}

@router.post("/{review_id}/approve")
def approve_case(review_id: int):
    return {"id": review_id, "status": ReviewStatus.APPROVED, "decision": ReviewDecision.APPROVE}

@router.post("/{review_id}/reject")
def reject_case(review_id: int):
    return {"id": review_id, "status": ReviewStatus.REJECTED, "decision": ReviewDecision.REJECT}

@router.get("/")
def list_reviews():
    return [{"id": 1, "case_id": 1, "status": ReviewStatus.PENDING}]
