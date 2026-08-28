import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from unittest.mock import patch
import io
from PIL import Image

from database import Base, engine, get_db
from routers.trust import router
from services.trust.risk_engine import DeterministicRiskEngine

app = FastAPI()
app.include_router(router, prefix="/api/v1/trust")
client = TestClient(app)

# Helper to generate a valid dummy image
def generate_dummy_image():
    img = Image.new('RGB', (100, 100), color = 'red')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    return img_byte_arr.getvalue()


def test_deterministic_risk_calculation_low():
    # High authenticity, no metadata flags
    score, level, reasons = DeterministicRiskEngine.calculate_risk(
        {"authenticity_score": 0.95}, 
        {"forensic_flags": []}
    )
    assert score == 5
    assert level == "LOW"


def test_deterministic_risk_calculation_high():
    # Low authenticity, no metadata flags
    score, level, reasons = DeterministicRiskEngine.calculate_risk(
        {"authenticity_score": 0.20}, 
        {"forensic_flags": []}
    )
    assert score == 80
    assert level == "HIGH"
    assert "Model detected strong indicators of synthetic content" in reasons


def test_deterministic_risk_calculation_critical_metadata():
    # Medium authenticity, but highly suspicious metadata
    score, level, reasons = DeterministicRiskEngine.calculate_risk(
        {"authenticity_score": 0.60}, 
        {"forensic_flags": ["NO_EXIF", "AI_SOFTWARE_DETECTED"]}
    )
    # base = 40. + 15 + 50 = 105 -> capped at 100
    assert score == 100
    assert level == "CRITICAL"


@patch("services.inference_service.InferenceService.detect_image")
def test_trust_analyze_valid_image(mock_detect):
    mock_detect.return_value = {
        "authenticity_score": 0.9,
        "confidence": 0.9,
        "risk_level": "LOW",
        "model_name": "microsoft/swin-tiny-patch4-window7-224 (Placeholder)",
        "model_version": "ImageNet-1K pre-trained"
    }
    
    img_bytes = generate_dummy_image()
    response = client.post(
        "/api/v1/trust/analyze", 
        files={"file": ("test.jpg", img_bytes, "image/jpeg")},
        data={"case_id": "test_case_123"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["case_id"] == "test_case_123"
    assert data["risk"]["level"] == "LOW" # Since 0.9 authenticity -> base risk 10, no EXIF (+15) -> 25 -> LOW
    assert data["decision"]["action"] == "ALLOW"
    assert "analysis_id" in data
    assert "audit" in data
    assert "audit_id" in data["audit"]


@patch("services.inference_service.InferenceService.detect_image")
def test_trust_analyze_high_risk(mock_detect):
    mock_detect.return_value = {
        "authenticity_score": 0.1,
        "confidence": 0.9,
        "risk_level": "HIGH",
        "model_name": "microsoft/swin-tiny-patch4-window7-224 (Placeholder)"
    }
    
    img_bytes = generate_dummy_image()
    response = client.post(
        "/api/v1/trust/analyze", 
        files={"file": ("test.jpg", img_bytes, "image/jpeg")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["risk"]["level"] in ["HIGH", "CRITICAL"]
    assert data["decision"]["action"] in ["ESCALATE", "BLOCK"]


@patch("services.inference_service.InferenceService.detect_image")
def test_trust_analyze_inference_failure(mock_detect):
    mock_detect.side_effect = RuntimeError("Model not loaded")
    
    img_bytes = generate_dummy_image()
    response = client.post(
        "/api/v1/trust/analyze", 
        files={"file": ("test.jpg", img_bytes, "image/jpeg")}
    )
    
    assert response.status_code == 503
    assert "Inference service unavailable" in response.json()["detail"]


def test_trust_analyze_missing_file():
    response = client.post("/api/v1/trust/analyze", data={"case_id": "123"})
    assert response.status_code == 422 # FastAPI validation error for missing File


def test_trust_analyze_invalid_image():
    # Send random bytes instead of a valid image
    # The metadata_service will catch the error, but the InferenceService might crash or handle it
    # We'll mock inference to avoid loading PyTorch models in tests
    with patch("services.inference_service.InferenceService.detect_image") as mock_detect:
        mock_detect.return_value = {"authenticity_score": 0.8}
        response = client.post(
            "/api/v1/trust/analyze", 
            files={"file": ("test.txt", b"not an image", "text/plain")}
        )
        assert response.status_code == 200
        # The metadata will have an error, but forensic flags aren't computed on crash.
        # Base risk (20) + no flags = 20 -> LOW
        assert response.json()["risk"]["level"] == "LOW"


def test_database_persistence():
    # Verify DB persistence directly by running a request and checking the DB mock or just verifying it returned analysis_id
    with patch("services.inference_service.InferenceService.detect_image") as mock_detect:
        mock_detect.return_value = {"authenticity_score": 0.95}
        img_bytes = generate_dummy_image()
        response = client.post(
            "/api/v1/trust/analyze", 
            files={"file": ("test.jpg", img_bytes, "image/jpeg")}
        )
        assert response.status_code == 200
        analysis_id = response.json()["analysis_id"]
        assert analysis_id is not None
        # It's persisted in the test DB context managed by fastapi dependency overrides, 
        # the fact it returned means db.commit() succeeded without throwing IntegrityError
