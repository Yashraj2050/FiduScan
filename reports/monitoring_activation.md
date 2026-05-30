# Phase 5B — Monitoring Activation
*Generated: 2026-05-31 01:38 IST*

## Observability Setup
The staging environment has been equipped with full-stack monitoring and alerting.

### 1. Uptime Monitoring
- Configured **Google Cloud Monitoring (Uptime Checks)** to ping `https://api.staging.fiduscan.com/health` every 1 minute from 3 global regions.
- Set an alerting policy to trigger if the health endpoint fails for more than 3 consecutive minutes.

### 2. Error Tracking
- Integrated **Sentry** SDK into both the Next.js Frontend and FastAPI Backend.
- Automatically captures uncaught exceptions, promise rejections, and slow API transactions.

### 3. API Monitoring & Logging
- Enabled **Cloud Logging** to aggregate standard stdout/stderr logs from the Cloud Run instances.
- Configured custom log-based metrics to track ML inference latency (e.g., `image_inference_ms > 3000ms`).

**Status: MONITORING FULLY ACTIVE**
