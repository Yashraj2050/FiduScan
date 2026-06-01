# Vercel Frontend Deployment Plan
*Generated: 2026-05-31 02:20 IST*

## Vercel Infrastructure Setup
Vercel will continue to host the Next.js frontend application.

### 1. Repository Integration
- Link the `FiduScan` GitHub repository directly to Vercel.
- Configure the root directory if the frontend lives in a subfolder (e.g., `./frontend`).

### 2. Environment Configuration
- Update the Vercel project's environment variables to point away from the Google Cloud Run URL and toward the new Railway backend URL.
  - `NEXT_PUBLIC_API_URL=https://fiduscan-backend.up.railway.app`

### 3. Edge Routing
- Ensure Vercel's `next.config.js` or `vercel.json` rewrite rules properly proxy `/api/v1/*` traffic to the Railway backend to avoid CORS issues.

**Status: VERCEL DEPLOYMENT DESIGNED**
