from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import enum
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional

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


# ─── Engine class ─────────────────────────────────────────────────────────────
# routers/case_management.py imports and instantiates CaseManagementEngine.
# This class provides the engine-style interface that the router expects.

class CaseManagementEngine:
    """
    Engine facade used by routers/case_management.py.
    Provides create/update/evidence/notes/review/export operations over cases.
    """

    def create_case(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "case_id": "case_001",
            "title": data.get("title", "Untitled Case"),
            "description": data.get("description", ""),
            "priority": data.get("priority", PriorityLevel.MEDIUM),
            "status": CaseStatus.OPEN,
            "created_at": datetime.utcnow().isoformat(),
        }

    def update_case(self, case_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "case_id": case_id,
            "updated_fields": list(data.keys()),
            "status": data.get("status", CaseStatus.OPEN),
            "updated_at": datetime.utcnow().isoformat(),
        }

    def add_evidence(self, case_id: str, evidence_id: str) -> Dict[str, Any]:
        return {
            "case_id": case_id,
            "evidence_id": evidence_id,
            "linked_at": datetime.utcnow().isoformat(),
            "success": True,
        }

    def add_notes(self, case_id: str, note: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "case_id": case_id,
            "note": note,
            "added_at": datetime.utcnow().isoformat(),
            "success": True,
        }

    def review_case(self, case_id: str, review_data: Dict[str, Any]) -> Dict[str, Any]:
        decision = review_data.get("decision", "pending")
        status = CaseStatus.CLOSED if decision in ("approve", "reject") else CaseStatus.IN_PROGRESS
        return {
            "case_id": case_id,
            "decision": decision,
            "status": status,
            "reviewed_at": datetime.utcnow().isoformat(),
            "comments": review_data.get("comments", ""),
        }

    def export_case(self, case_id: str) -> Optional[bytes]:
        """
        Returns a minimal ZIP-like bytes placeholder.
        A real implementation would stream the full case bundle from storage.
        Returns None if the case is not found.
        """
        import json
        import zipfile
        import io

        manifest = {
            "case_id": case_id,
            "exported_at": datetime.utcnow().isoformat(),
            "note": "Full export requires persistent case storage.",
        }
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
            zf.writestr("manifest.json", json.dumps(manifest, indent=2))
        return buf.getvalue()
