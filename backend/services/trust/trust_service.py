import uuid
from typing import Optional
from sqlalchemy.orm import Session

from services.inference_service import InferenceService
from services.metadata_service import extract_metadata
from services.trust.risk_engine import DeterministicRiskEngine
from services.trust.agent import TrustAgent
from services.trust.schemas import (
    TrustAnalysisResponse,
    TrustRisk,
    TrustEvidence,
    TrustEvidenceImage,
    TrustDecision,
    TrustAudit,
    AgentResult
)
from models import TrustAnalysisLog
from audit_service import AuditLogger
from audit_models import EventType


class TrustService:
    @staticmethod
    def analyze_evidence(
        db: Session,
        file_bytes: bytes,
        filename: str,
        case_id: Optional[str] = None
    ) -> TrustAnalysisResponse:
        
        # 1. Metadata Analysis
        metadata_result = extract_metadata(file_bytes, filename)
        
        # 2. Image Inference
        # This will raise RuntimeError if the model is unavailable or fails.
        # The router will catch it and return 503.
        inference_result = InferenceService.detect_image(file_bytes)
        
        # 3. Deterministic Risk Engine
        score, level, reasons = DeterministicRiskEngine.calculate_risk(
            inference_result, metadata_result
        )
        
        # 4. Deterministic Trust Decision (Policy)
        if level == "LOW":
            policy_action = "ALLOW"
            policy_requires_human_review = False
        elif level == "MEDIUM":
            policy_action = "REQUIRE_VERIFICATION"
            policy_requires_human_review = True
        elif level == "HIGH":
            policy_action = "ESCALATE"
            policy_requires_human_review = True
        else: # CRITICAL
            policy_action = "BLOCK"
            policy_requires_human_review = True
            
        # 5. Trust Agent Reasoning
        agent_result = TrustAgent.evaluate(
            inference_result=inference_result,
            metadata_result=metadata_result,
            risk_score=score,
            risk_level=level
        )
        
        # 6. Policy Guardrail (Final Decision)
        severity_map = {
            "ALLOW": 0,
            "REQUIRE_VERIFICATION": 1,
            "ESCALATE": 2,
            "BLOCK": 3
        }
        
        final_action = policy_action
        final_human_review = policy_requires_human_review
        
        if agent_result.status == "AVAILABLE" and agent_result.recommended_action:
            agent_action = agent_result.recommended_action
            if severity_map.get(agent_action, 1) > severity_map.get(policy_action, 1):
                final_action = agent_action
            if agent_result.human_review_required:
                final_human_review = True

        # 7. Persist the Analysis
        analysis_id = str(uuid.uuid4())
        evidence_id = str(uuid.uuid4())
        
        db_log = TrustAnalysisLog(
            id=analysis_id,
            case_id=case_id,
            evidence_id=evidence_id,
            risk_score=score,
            risk_level=level,
            decision=final_action,
            metadata_json=metadata_result,
            model_result_json=inference_result
        )
        db.add(db_log)
        db.commit()
        
        # 8. Audit Logging
        # Default to "demo_org" since the endpoint is unauthenticated
        audit_org_id = "demo_org"
        audit_metadata = {
            "analysis_id": analysis_id,
            "evidence_id": evidence_id,
            "risk_score": score,
            "risk_level": level,
            "deterministic_policy": policy_action,
            "final_decision": final_action,
            "agent_status": agent_result.status
        }
        if agent_result.status == "AVAILABLE":
            audit_metadata["agent_recommendation"] = agent_result.recommended_action
            
        audit_event = AuditLogger.log_event(
            db=db,
            org_id=audit_org_id,
            action="trust_analysis",
            event_type=EventType.SECURITY,
            resource_type="case" if case_id else "image",
            resource_id=case_id if case_id else evidence_id,
            metadata=audit_metadata
        )
        
        # 9. Construct Response
        image_evidence = TrustEvidenceImage(
            classification=inference_result.get("risk_level", "UNKNOWN"),
            confidence=inference_result.get("confidence", 0.0),
            model=inference_result.get("model_name", "UNKNOWN")
        )
        
        return TrustAnalysisResponse(
            analysis_id=analysis_id,
            case_id=case_id,
            risk=TrustRisk(
                score=score,
                level=level,
                reasons=reasons
            ),
            evidence=TrustEvidence(
                image=image_evidence,
                metadata=metadata_result
            ),
            decision=TrustDecision(
                action=final_action,
                requires_human_review=final_human_review
            ),
            audit=TrustAudit(
                audit_id=str(audit_event.id)
            ),
            agent=agent_result
        )
