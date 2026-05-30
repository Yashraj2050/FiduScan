# Phase 5B — Backend Staging Validation
*Generated: 2026-05-31 01:36 IST*

## Backend Cloud Run Deployment
The stateless FastAPI backend housing the multimodal detection models has been containerized, pushed to Artifact Registry, and deployed to Google Cloud Run.

* **Service Name:** `fiduscan-api-staging`
* **Concurrency:** 80 concurrent requests per instance
* **Memory / CPU:** 4 GB / 2 vCPUs (Required to load EfficientNet, Whisper, and Wav2Vec2 into memory).

## Endpoint Validation

### 1. Authentication
- `POST /api/v1/auth/login`: Verified. Successfully issues JWT tokens using Argon2 hashed credentials.
- `GET /api/v1/auth/me`: Verified. Correctly parses Authorization headers and queries the Cloud SQL staging database.

### 2. Modality Endpoints
- `POST /api/v1/analyze/image`: Verified. Successfully loads `efficientnet_phase2c.pth` and returns a real-time forensic score.
- `POST /api/v1/analyze/audio`: Verified. Whisper feature extraction and Wav2Vec2 classification execute successfully against GCS-hosted audio streams.
- `POST /api/v1/analyze/video`: Verified. Video frame extraction logic correctly parses pre-signed video URLs.

### 3. Cold Start Performance
- Measured initial container cold start at ~6.2 seconds due to heavy PyTorch model weights.
- Enabled Cloud Run **CPU Allocation during idle** to mitigate cold starts for subsequent requests.

**Status: BACKEND DEPLOYED AND VALIDATED**
