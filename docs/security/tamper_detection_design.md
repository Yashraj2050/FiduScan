# Tamper Detection & Build Hardening

## Overview
This document outlines the mechanisms for detecting tampering with the FiduScan application code, both on the backend and frontend, and details strategies for hardening the build pipeline.

## 1. Build Hardening
- **Mechanism:** Secure the CI/CD pipeline to prevent supply chain attacks and unauthorized code modifications.
- **Implementation:**
  - Enforce signed commits and branch protection rules requiring multiple approvals.
  - Integrate Software Bill of Materials (SBOM) generation and continuous dependency scanning (e.g., Snyk, Dependabot).
  - Implement deterministic (reproducible) builds to ensure that the source code always produces the exact same binary artifact.

## 2. Source-Map Handling
- **Mechanism:** Protect proprietary business logic and React application structure on the frontend.
- **Implementation:**
  - Disable source map generation for production builds entirely.
  - For error tracking (e.g., Sentry), generate source maps in CI, upload them securely using authentication tokens, and immediately delete them before the artifact is packaged or deployed to the CDN.
  - Employ aggressive JavaScript minification and obfuscation (e.g., Terser) to complicate reverse engineering of the bundled code.

## 3. Tamper Detection
- **Mechanism:** Detect unauthorized modifications to deployed artifacts at runtime.
- **Implementation:**
  - **Backend:** Implement File Integrity Monitoring (FIM) on the inference servers and backend containers to detect unexpected changes to application binaries or model files.
  - **Frontend:** Implement Subresource Integrity (SRI) on all external scripts. Use a Service Worker to verify the hash of fetched critical application chunks against a trusted manifest. If tampering is detected, block execution and log a critical security event to the SIEM.
