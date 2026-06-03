# Workflow Gaps (Phases 11-13)

## Overview
This document highlights broken or incomplete user journeys identified during the end-to-end integration audit.

## 1. Media Upload to Verification Pipeline
- **Gap:** Currently, users uploading images for Deepfake Detection (Phase 1-9 core feature) are not offered the ability to also check for FiduScan watermarks automatically. The detection and watermarking pipelines are disjointed.

## 2. Report Generation Trigger
- **Gap:** Authenticity Reports (`/api/v1/reports/generate`) must be called manually via the API. The core detection service does not automatically dispatch a task to generate a report upon scan completion.

## 3. Blockchain Anchoring Latency
- **Gap:** If blockchain anchoring is integrated synchronously into the verification workflow, it will severely degrade API response times.
- **Requirement:** The blockchain anchoring must be decoupled into an asynchronous background worker (e.g., Celery/Redis) with the UI polling for status updates via websockets.

## 4. Unauthenticated Access
- **Gap:** Watermark embedding endpoints currently lack strict integration with the FiduScan user billing/authentication context. This allows theoretical API abuse if endpoints are exposed without tying the watermark payload to the authenticated user ID.
