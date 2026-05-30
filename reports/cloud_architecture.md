# Phase 5A — Cloud Architecture Design
*Generated: 2026-05-30 19:39 UTC*

## Topology Overview
FiduScan will adopt a decoupled, serverless-first architecture optimized for stateless ML inference.

- **Frontend**: Next.js (React) deployed globally on Vercel or Firebase Hosting.
- **Backend API**: FastAPI running in stateless Docker containers on Cloud Run (GCP). Auto-scales to zero.
- **Database**: Managed PostgreSQL handling Users, Scans, and Audit Logs.
- **Storage**: Cloud Storage (GCS/S3) for asynchronous multimedia holding and pre-signed upload URLs.
- **Inference**: EfficientNet-B0 (Image) and Audio/Video aggregators bundled inside the backend container. No external GPU orchestration needed for the MVP.

