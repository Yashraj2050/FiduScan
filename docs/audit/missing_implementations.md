# Missing Implementations

## 1. Developer Portal
- **Status:** Completely missing. 
- **Details:** The v4.1 Release Notes claimed robust webhook signing and delivery retries, but no such code exists in the `backend/` directory, nor are there database migrations for storing API keys. The frontend lacks any UI for developers to generate keys.

## 2. Audio & Video Watermarking (Persistence)
- **Status:** Partially implemented.
- **Details:** The algorithms exist and are wired to API endpoints (`audio_watermark.py`, `video_watermark.py`), but they do not persist the generated watermark IDs into a PostgreSQL database table, resulting in stateless operation. Furthermore, the Next.js UI does not provide an interface specifically designed to upload/play audio or video for this workflow.
