import pytest
from unittest.mock import patch, MagicMock
import os
import json

from services.trust.agent import TrustAgent
from services.trust.schemas import AgentResult
from services.trust.trust_service import TrustService

@patch("services.trust.agent.requests.post")
@patch.dict(os.environ, {"TRUST_AGENT_API_KEY": "dummy_key", "TRUST_AGENT_PROVIDER": "gemini"})
def test_trust_agent_valid_response(mock_post):
    mock_response = MagicMock()
    mock_response.json.return_value = {
        "candidates": [
            {
                "content": {
                    "parts": [
                        {"text": json.dumps({
                            "assessment": "Looks suspicious.",
                            "key_factors": ["No EXIF", "High synthetic score"],
                            "recommended_action": "ESCALATE",
                            "human_review_required": True,
                            "confidence": 0.95
                        })}
                    ]
                }
            }
        ]
    }
    mock_post.return_value = mock_response

    result = TrustAgent.evaluate({}, {}, 80, "HIGH")
    
    assert result.status == "AVAILABLE"
    assert result.recommended_action == "ESCALATE"
    assert result.assessment == "Looks suspicious."
    assert result.confidence == 0.95


@patch.dict(os.environ, {"TRUST_AGENT_API_KEY": ""})
def test_trust_agent_missing_api_key():
    result = TrustAgent.evaluate({}, {}, 80, "HIGH")
    assert result.status == "UNAVAILABLE"


@patch("services.trust.agent.requests.post")
@patch.dict(os.environ, {"TRUST_AGENT_API_KEY": "dummy_key", "TRUST_AGENT_PROVIDER": "gemini"})
def test_trust_agent_malformed_json(mock_post):
    mock_response = MagicMock()
    mock_response.json.return_value = {
        "candidates": [{"content": {"parts": [{"text": "Not JSON at all"}]}}]
    }
    mock_post.return_value = mock_response

    result = TrustAgent.evaluate({}, {}, 80, "HIGH")
    assert result.status == "UNAVAILABLE"


def test_trust_service_guardrails():
    # Test that policy guardrails work even if agent says ALLOW for a HIGH risk image.
    inference_result = {"risk_level": "HIGH", "confidence": 0.9}
    metadata_result = {"forensic_flags": []}
    
    with patch("services.inference_service.InferenceService.detect_image", return_value=inference_result):
        with patch("services.metadata_service.extract_metadata", return_value=metadata_result):
            with patch("services.trust.risk_engine.DeterministicRiskEngine.calculate_risk", return_value=(80, "HIGH", [])):
                
                # Agent maliciously/incorrectly says ALLOW
                agent_result = AgentResult(
                    status="AVAILABLE",
                    assessment="It is fine.",
                    key_factors=[],
                    recommended_action="ALLOW",
                    human_review_required=False,
                    confidence=0.1
                )
                
                with patch("services.trust.agent.TrustAgent.evaluate", return_value=agent_result):
                    db_mock = MagicMock()
                    response = TrustService.analyze_evidence(db_mock, b"fake_bytes", "test.jpg")
                    
                    # Policy was HIGH -> ESCALATE (2)
                    # Agent said ALLOW -> (0)
                    # Final action should be ESCALATE (Max of Policy and Agent)
                    assert response.decision.action == "ESCALATE"
                    # But the agent object is returned
                    assert response.agent.recommended_action == "ALLOW"
                    

def test_trust_service_agent_escalation():
    # Test that if policy is LOW but agent says BLOCK, the final action is BLOCK
    with patch("services.trust.risk_engine.DeterministicRiskEngine.calculate_risk", return_value=(10, "LOW", [])):
        agent_result = AgentResult(
            status="AVAILABLE",
            assessment="I found a hidden pattern.",
            key_factors=["Hidden watermark"],
            recommended_action="BLOCK",
            human_review_required=True,
            confidence=0.9
        )
        with patch("services.trust.agent.TrustAgent.evaluate", return_value=agent_result):
            with patch("services.inference_service.InferenceService.detect_image", return_value={}):
                with patch("services.metadata_service.extract_metadata", return_value={}):
                    db_mock = MagicMock()
                    response = TrustService.analyze_evidence(db_mock, b"fake", "test.jpg")
                    
                    # Policy was LOW -> ALLOW
                    # Agent said BLOCK
                    assert response.decision.action == "BLOCK"
                    assert response.decision.requires_human_review == True
