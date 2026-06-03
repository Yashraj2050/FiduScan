from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import enum
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

Base = declarative_base()

class CaseStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    CLOSED = "closed"

class PriorityLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class Case(Base):
    __tablename__ = "cases"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    owner = Column(String)
    status = Column(Enum(CaseStatus), default=CaseStatus.OPEN)
    priority = Column(Enum(PriorityLevel), default=PriorityLevel.MEDIUM)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    evidence = relationship("CaseEvidence", back_populates="case")
    reports = relationship("CaseReport", back_populates="case")

class CaseEvidence(Base):
    __tablename__ = "case_evidence"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    evidence_id = Column(String)
    case = relationship("Case", back_populates="evidence")

class CaseReport(Base):
    __tablename__ = "case_reports"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    report_id = Column(String)
    case = relationship("Case", back_populates="reports")

router = APIRouter(prefix="/cases", tags=["cases"])

class CaseCreate(BaseModel):
    title: str
    description: str
    priority: PriorityLevel = PriorityLevel.MEDIUM

@router.post("/")
def create_case(case: CaseCreate):
    return {"id": 1, "title": case.title, "status": CaseStatus.OPEN}

@router.get("/")
def list_cases():
    return [{"id": 1, "title": "Test Case", "status": CaseStatus.OPEN}]

@router.get("/{case_id}")
def get_case(case_id: int):
    return {"id": case_id, "title": "Test Case", "status": CaseStatus.OPEN}

@router.put("/{case_id}")
def update_case(case_id: int, case: CaseCreate):
    return {"id": case_id, "title": case.title, "status": CaseStatus.OPEN}

@router.delete("/{case_id}")
def delete_case(case_id: int):
    return {"success": True}

@router.post("/{case_id}/evidence")
def link_evidence(case_id: int, evidence_id: str):
    return {"success": True, "case_id": case_id, "evidence_id": evidence_id}

@router.post("/{case_id}/reports")
def link_report(case_id: int, report_id: str):
    return {"success": True, "case_id": case_id, "report_id": report_id}
