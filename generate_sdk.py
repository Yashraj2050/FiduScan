import os

os.makedirs("sdks/python/fiduscan", exist_ok=True)
os.makedirs("sdks/python/tests", exist_ok=True)

with open("sdks/python/fiduscan/errors.py", "w") as f:
    f.write("""
class FiduScanError(Exception):
    pass

class APIError(FiduScanError):
    def __init__(self, message, status_code=None, payload=None):
        super().__init__(message)
        self.status_code = status_code
        self.payload = payload

class AuthenticationError(APIError):
    pass

class ValidationError(APIError):
    pass

class RateLimitError(APIError):
    pass
""")

with open("sdks/python/fiduscan/client.py", "w") as f:
    f.write("""
import requests
from .errors import APIError, AuthenticationError, ValidationError, RateLimitError

class Client:
    def __init__(self, api_key=None, bearer_token=None, base_url="https://api.fiduscan.io/v1"):
        self.base_url = base_url
        self.headers = {"Content-Type": "application/json"}
        if api_key:
            self.headers["X-API-Key"] = api_key
        elif bearer_token:
            self.headers["Authorization"] = f"Bearer {bearer_token}"
        else:
            raise ValueError("Must provide api_key or bearer_token")

    def request(self, method, path, **kwargs):
        url = f"{self.base_url}{path}"
        response = requests.request(method, url, headers=self.headers, **kwargs)
        if response.status_code >= 400:
            self._handle_error(response)
        return response.json()

    def _handle_error(self, response):
        status = response.status_code
        try:
            payload = response.json()
            message = payload.get("detail", response.text)
        except Exception:
            payload = None
            message = response.text

        if status in (401, 403):
            raise AuthenticationError(message, status, payload)
        elif status == 422:
            raise ValidationError(message, status, payload)
        elif status == 429:
            raise RateLimitError(message, status, payload)
        else:
            raise APIError(message, status, payload)
""")

with open("sdks/python/fiduscan/detection.py", "w") as f:
    f.write("""
class DetectionClient:
    def __init__(self, client):
        self.client = client

    def detect_image(self, file_path):
        with open(file_path, "rb") as f:
            return self.client.request("POST", "/detect/image", files={"file": f})

    def detect_audio(self, file_path):
        with open(file_path, "rb") as f:
            return self.client.request("POST", "/detect/audio", files={"file": f})

    def detect_video(self, file_path):
        with open(file_path, "rb") as f:
            return self.client.request("POST", "/detect/video", files={"file": f})
""")

with open("sdks/python/fiduscan/watermark.py", "w") as f:
    f.write("""
class WatermarkClient:
    def __init__(self, client):
        self.client = client

    def embed_watermark(self, file_path, payload):
        with open(file_path, "rb") as f:
            return self.client.request("POST", "/watermark/embed", files={"file": f}, data={"payload": payload})

    def verify_watermark(self, file_path):
        with open(file_path, "rb") as f:
            return self.client.request("POST", "/watermark/verify", files={"file": f})
""")

with open("sdks/python/fiduscan/evidence.py", "w") as f:
    f.write("""
class EvidenceClient:
    def __init__(self, client):
        self.client = client

    def create_evidence(self, metadata):
        return self.client.request("POST", "/evidence", json=metadata)

    def verify_evidence(self, evidence_id):
        return self.client.request("GET", f"/evidence/{evidence_id}/verify")
""")

with open("sdks/python/fiduscan/blockchain.py", "w") as f:
    f.write("""
class BlockchainClient:
    def __init__(self, client):
        self.client = client

    def create_anchor(self, evidence_id):
        return self.client.request("POST", "/blockchain/anchor", json={"evidence_id": evidence_id})

    def verify_anchor(self, anchor_id):
        return self.client.request("GET", f"/blockchain/anchor/{anchor_id}/verify")
""")

with open("sdks/python/fiduscan/cases.py", "w") as f:
    f.write("""
class CasesClient:
    def __init__(self, client):
        self.client = client

    def create_case(self, title, description):
        return self.client.request("POST", "/cases", json={"title": title, "description": description})

    def update_case(self, case_id, updates):
        return self.client.request("PUT", f"/cases/{case_id}", json=updates)
""")

with open("sdks/python/fiduscan/reports.py", "w") as f:
    f.write("""
class ReportsClient:
    def __init__(self, client):
        self.client = client

    def generate_report(self, case_id, format="pdf"):
        return self.client.request("POST", "/reports/generate", json={"case_id": case_id, "format": format})
""")

with open("sdks/python/fiduscan/__init__.py", "w") as f:
    f.write("""
from .client import Client
from .detection import DetectionClient
from .watermark import WatermarkClient
from .evidence import EvidenceClient
from .blockchain import BlockchainClient
from .cases import CasesClient
from .reports import ReportsClient

class FiduScan:
    def __init__(self, api_key=None, bearer_token=None, base_url="https://api.fiduscan.io/v1"):
        self.client = Client(api_key=api_key, bearer_token=bearer_token, base_url=base_url)
        self.detection = DetectionClient(self.client)
        self.watermark = WatermarkClient(self.client)
        self.evidence = EvidenceClient(self.client)
        self.blockchain = BlockchainClient(self.client)
        self.cases = CasesClient(self.client)
        self.reports = ReportsClient(self.client)
""")

with open("sdks/python/setup.py", "w") as f:
    f.write("""
from setuptools import setup, find_packages

setup(
    name="fiduscan",
    version="1.0.0",
    description="Official Python SDK for FiduScan API",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    author="FiduScan",
    packages=find_packages(),
    install_requires=["requests"],
    python_requires=">=3.8",
)
""")

with open("sdks/python/README.md", "w") as f:
    f.write("""
# FiduScan Python SDK

Official Python SDK for integrating the FiduScan Digital Authenticity & Evidence Platform.

## Installation

```bash
pip install fiduscan
```

## Quick Start

```python
from fiduscan import FiduScan

# Initialize with API Key
sdk = FiduScan(api_key="your_api_key")

# 1. Detect Deepfake
result = sdk.detection.detect_image("path/to/image.jpg")
print(result)

# 2. Embed Watermark
watermark = sdk.watermark.embed_watermark("path/to/media.mp4", "payload_data")

# 3. Create Case
case = sdk.cases.create_case(title="Investigation A", description="Details here")
```
""")

with open("sdks/python/tests/test_sdk.py", "w") as f:
    f.write("""
import unittest
from unittest.mock import patch, MagicMock
from fiduscan import FiduScan
from fiduscan.errors import AuthenticationError, RateLimitError

class TestFiduScanSDK(unittest.TestCase):
    def setUp(self):
        self.sdk = FiduScan(api_key="test_key")

    @patch("fiduscan.client.requests.request")
    def test_detect_image(self, mock_req):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {"fake_probability": 0.99}
        mock_req.return_value = mock_resp
        
        with patch("builtins.open", unittest.mock.mock_open(read_data=b"data")):
            res = self.sdk.detection.detect_image("test.jpg")
            
        self.assertEqual(res["fake_probability"], 0.99)
        mock_req.assert_called_once()

    @patch("fiduscan.client.requests.request")
    def test_auth_error(self, mock_req):
        mock_resp = MagicMock()
        mock_resp.status_code = 401
        mock_resp.json.return_value = {"detail": "Invalid key"}
        mock_req.return_value = mock_resp
        
        with self.assertRaises(AuthenticationError):
            self.sdk.cases.create_case("T", "D")

    @patch("fiduscan.client.requests.request")
    def test_rate_limit(self, mock_req):
        mock_resp = MagicMock()
        mock_resp.status_code = 429
        mock_resp.json.return_value = {"detail": "Too many"}
        mock_req.return_value = mock_resp
        
        with self.assertRaises(RateLimitError):
            self.sdk.blockchain.create_anchor("ev_123")

if __name__ == "__main__":
    unittest.main()
""")

print("SDK Generated")
