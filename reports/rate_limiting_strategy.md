# Phase 5C — Rate Limiting Policy
*Generated: 2026-05-31 01:40 IST*

## Tiered Access Policy
To protect infrastructure from abuse and manage compute costs (especially for video), we have designed a strict tiered rate-limiting policy.

### 1. Free Tier (Beta Users)
Designed for casual users and beta testers.
- **Image Scans:** 50 per day
- **Audio Scans:** 10 per day
- **Video Scans:** 2 per day
- **API Limits:** 10 requests per minute

### 2. Pro Tier ($15/month)
Designed for journalists, researchers, and heavy individual users.
- **Image Scans:** 1,000 per day
- **Audio Scans:** 200 per day
- **Video Scans:** 50 per day
- **API Limits:** 60 requests per minute

### 3. Enterprise Tier (Custom Pricing)
Designed for media organizations and social platforms via API.
- **Scans:** Custom pooled quota (e.g., 100,000/month).
- **API Limits:** 500 requests per minute.

## Implementation Layer
- Rate limiting will be enforced at the **FastAPI Middleware layer** using Redis (`fastapi-limiter`) to track IP addresses (for unauthenticated routes) and `user_id` (for authenticated routes).

**Status: RATE LIMITING STRATEGY DEFINED**
