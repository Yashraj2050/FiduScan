# Railway Backend Deployment Plan
*Generated: 2026-05-31 02:19 IST*

## Railway Infrastructure Setup
Railway will host the FastAPI forensic backend, replacing Google Cloud Run.

### 1. Docker Deployment
- **Repository Link:** Connect the GitHub repository to a new Railway project.
- **Build Configuration:** Railway will automatically detect the `Dockerfile` and build the image.
- **Start Command:** Ensure the `Procfile` or Docker entrypoint runs `uvicorn main:app --host 0.0.0.0 --port $PORT`.

### 2. Compute Requirements
- The machine learning models require significant RAM. The Railway service must be scaled to the **8GB RAM / 4 vCPU** tier to prevent Out-Of-Memory (OOM) crashes during video processing.

### 3. Model Artifacts
- Model weights are bundled inside the Docker image. The image size is ~2-3GB. Railway's build pipeline can handle this, but the initial cold start may take up to 60 seconds.

**Status: RAILWAY DEPLOYMENT DESIGNED**
