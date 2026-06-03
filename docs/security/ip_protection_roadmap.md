# IP Protection & Model Security Roadmap (Phase 10A.2)

## Overview
This document outlines the phased implementation plan for securing FiduScan's intellectual property, specifically targeting model protection, inference security, and tamper detection.

## Phase 1 (Weeks 1-2): Model Storage & Signing
- **Encrypted Storage:** Migrate all model artifacts in S3 to use Customer Managed Keys (CMKs) in AWS KMS.
- **Model Signing:** Integrate cryptographic signing of model artifacts into the CI/CD pipeline.
- **Loading Verification:** Implement signature validation in the inference service before models are loaded into memory.

## Phase 2 (Weeks 3-4): Inference Isolation & Endpoint Hardening
- **Network Isolation:** Move all inference workers to private subnets; configure strict security groups and API Gateway routing.
- **Output Perturbation:** Implement deterministic noise injection on inference API responses to prevent distillation attacks.
- **Rate Limiting:** Deploy aggressive, dedicated rate limits for inference endpoints to block brute-force extraction attempts.

## Phase 3 (Weeks 5-6): Build Hardening & Source-Map Security
- **Source Maps:** Refactor CI/CD to upload source maps to error tracking (Sentry) and strip them from the production bundle.
- **Frontend Obfuscation:** Integrate Terser/JavaScript Obfuscator into the build process with aggressive settings.
- **Pipeline Security:** Enforce SBOM generation and signed commits across all repositories.

## Phase 4 (Weeks 7-8): Tamper Detection
- **Backend FIM:** Deploy File Integrity Monitoring (FIM) agents on production inference containers.
- **Frontend SRI:** Generate and inject Subresource Integrity (SRI) hashes for all CDN-hosted assets.
- **Alerting Integration:** Connect FIM and SRI failure events to the central SIEM for immediate alerting and response.

## Effort Estimation
Total estimated effort for Phase 10A.2 implementation is approximately 28 days (4 sprints).
