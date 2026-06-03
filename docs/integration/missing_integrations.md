# Missing Integrations (Phases 11-13)

## Overview
This document catalogs all features designed and implemented on the backend that completely lack frontend representation or durable persistence mechanisms.

## 1. UI Integrations Missing
All major capabilities delivered in Phases 11-13 are strictly API-only right now. The dashboard completely lacks:
- **Watermark Upload UI:** No interface exists to upload media to be embedded with a watermark.
- **Verification UI:** No interface exists to upload media and check for FiduScan watermarks.
- **Reporting UI:** Users cannot view or download authenticity reports generated for their media.
- **Evidence UI:** No chain of custody dashboard.
- **Blockchain UI:** No interface displaying the Polygon transaction hash or confirmation status.

## 2. Database Integrations Missing
The following backend modules rely on temporary, in-memory structures or completely lack database bindings:
- **Evidence Chain:** `evidence_chain.py` uses an in-memory dictionary. A PostgreSQL table migration is missing.
- **Blockchain Anchors:** `blockchain.py` uses an in-memory dictionary.
- **Watermark Payloads:** Generated IDs are not persisted in PostgreSQL to link with user accounts.

## 3. Orphaned Components
- The entire `audio_watermark.py` and `video_watermark.py` engines are fully orphaned from the perspective of the end-user since they cannot interact with them without raw API calls.
