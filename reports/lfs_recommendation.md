# Git Remediation — Git LFS Evaluation
*Generated: 2026-05-30 19:47 UTC*

## Introduction
Git Large File Storage (LFS) replaces large files with text pointers inside Git, storing the file contents on a remote server. We evaluate Git LFS suitability for FiduScan's model checkpoints vs alternative storage designs.

## Comparison Matrix

| Aspect | Git LFS | Cloud Object Storage (S3/GCS) | No Git Tracking (Local/Script) |
|--------|---------|-------------------------------|--------------------------------|
| **Developer Workflow** | Transparent (standard `git push/pull`) | Manual (needs `gsutil` / CLI) | Cleanest (models handled out-of-band) |
| **Storage & Bandwidth Costs** | Expensive (GitHub limits LFS to 1GB free) | Extremely Cheap ($0.02/GB storage) | Free (for local dev) / Cheap (for cloud) |
| **CI/CD Compatibility** | Poor (requires LFS client inside runner) | Good (direct download via GCP IAM) | Excellent (pulled during Docker build) |
| **Docker Image Bloat** | High (checkpoints baked into git clone) | Low (fetched only when needed) | Configurable |

## Critical Constraints of Git LFS
1. **GitHub Pricing:** GitHub charges $5/month per 50GB of storage/bandwidth once the 1GB free quota is exceeded. Cloning a 500MB repository multiple times during development/testing will exhaust the bandwidth quota in hours.
2. **Serverless Deployment Compatibility:** When deploying to serverless platforms like GCP Cloud Run, cloning a repo that uses Git LFS requires the Docker build to install `git-lfs`, authenticate with Git, and run `git lfs pull`. This increases build times, build complexity, and authentication risk (leaking git credentials inside the builder).

## Recommendation
We **strongly recommend against using Git LFS** for storing ML checkpoints in production. Instead:
1. **Exclude all checkpoints** from Git using the hardened `.gitignore`.
2. **Upload checkpoints to a secure Cloud Storage bucket** (e.g., `gs://fiduscan-model-weights/`).
3. **Download weights during Docker build** using a shell script or directly inside Python (`security/crypto.py`) if they are encrypted. This separates code changes from binary weight updates and keeps the repository lightweight.

