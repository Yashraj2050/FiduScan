# Phase 5A — Deployment Automation
*Generated: 2026-05-30 19:39 UTC*

## CI/CD Workflow (GitHub Actions)
1. **Trigger**: Push to `main` (Staging) or `release` (Production).
2. **Test**: Run `pytest` and Phase 4A Validator scripts.
3. **Build**: Build the Dockerfile containing the FiduScan FastAPI app and baked-in ML models.
4. **Push**: Push to Google Artifact Registry.
5. **Deploy**: Deploy the new container digest to Cloud Run. Traffic splits automatically for zero-downtime rollouts.

