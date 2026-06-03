# End-to-End Workflow Integration Map

## Overview
This document maps the fully integrated end-to-end user workflows for FiduScan's authenticity features across all media types (Image, Audio, Video).

## 1. Image Workflow
1. **Embed:** User uploads an image via the Frontend UI (`/watermark/page.tsx`). The backend API (`/api/v1/watermark/embed`) generates a payload, embeds it, and stores the ID in the database.
2. **Verify:** User uploads a suspect image. The backend (`/api/v1/watermark/detect`) extracts the payload and verifies its cryptographic integrity.
3. **Report:** The verification triggers Authenticity Reports (`/api/v1/reports/generate`), producing a forensic JSON/PDF report.
4. **Evidence:** The report hash, file hash, and watermark ID are compiled into an Evidence Record (`/api/v1/evidence/create`).
5. **Blockchain:** The Evidence Record is submitted to the Blockchain Anchoring service (`/api/v1/blockchain/anchor`), recording the transaction on Polygon.

## 2. Audio Workflow
Follows the exact same 5-step pipelined progression as the Image Workflow, originating from the `/api/v1/audio_watermark/` subsystem.

## 3. Video Workflow
Follows the exact same 5-step pipelined progression as the Image Workflow, originating from the `/api/v1/video_watermark/` subsystem.

## Resolution Summary
- **Orphaned Components (2):** Audio and Video engines have been fully wired into the central frontend dispatcher.
- **Missing Integrations (5):** UI access built for all media types. Database persistence modules activated across all engines. Reports, Evidence, and Blockchain endpoints chained synchronously.
