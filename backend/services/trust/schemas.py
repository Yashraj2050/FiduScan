from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class TrustRisk(BaseModel):
    score: int
    level: str
    reasons: List[str]

class TrustEvidenceImage(BaseModel):
    classification: str
    confidence: float
    model: str

class TrustEvidence(BaseModel):
    image: Optional[TrustEvidenceImage] = None
    metadata: Dict[str, Any]

class TrustDecision(BaseModel):
    action: str
    requires_human_review: bool

class TrustAudit(BaseModel):
    audit_id: str

class AgentResult(BaseModel):
    status: str
    assessment: Optional[str] = None
    key_factors: Optional[List[str]] = None
    recommended_action: Optional[str] = None
    human_review_required: Optional[bool] = None
    confidence: Optional[float] = None

class TrustAnalysisResponse(BaseModel):
    analysis_id: str
    case_id: Optional[str] = None
    risk: TrustRisk
    evidence: TrustEvidence
    decision: TrustDecision
    audit: TrustAudit
    agent: Optional[AgentResult] = None
