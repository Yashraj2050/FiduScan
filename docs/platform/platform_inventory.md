# Platform Capabilities Inventory

## Overview
This document catalogs every user-facing and API capability currently implemented across the FiduScan v2.9 backend, highlighting where UI implementations are missing or orphaned.

## 1. Scanner (Deepfake Detection)
- **API:** Image, Audio, and Video inference endpoints (`/api/v1/detect`, `/api/v1/audio`, `/api/v1/video`).
- **UI:** Basic unified dashboard exists for image scanning. Audio/Video scanning UI needs improvement.

## 2. Watermarking
- **API:** Embedding and extraction endpoints across Image, Audio, and Video (`/api/v1/watermark`, `/api/v1/audio_watermark`, `/api/v1/video_watermark`).
- **UI:** A basic skeleton page exists (`/watermark/page.tsx`), but lacks deep workflow integration.

## 3. Reports
- **API:** Generation, download, and verification of forensic authenticity reports (`/api/v1/reports`).
- **UI:** Missing.

## 4. Evidence
- **API:** Chain of custody logging, evidence record creation (`/api/v1/evidence`).
- **UI:** Missing.

## 5. Blockchain
- **API:** Anchoring evidence to Polygon, checking status (`/api/v1/blockchain`).
- **UI:** Missing.

## 6. Cases
- **API:** Enterprise case management, linking evidence and notes (`/api/v1/cases`).
- **UI:** Missing.

## 7. Billing
- **API:** Stripe integration, quota tracking, subscription management (`/api/v1/billing`).
- **UI:** Quota bar exists. Subscriptions UI needs expansion.

## 8. Developer Portal
- **API:** API key generation, revocation, and scope management (`/api/v1/apikeys`).
- **UI:** Partially exists.
