# Phase 5B — HTTPS & Security Configuration
*Generated: 2026-05-31 01:38 IST*

## Secure Routing
All traffic to the staging environment is fully encrypted in transit. Insecure HTTP requests are automatically redirected to HTTPS.

### TLS Certificates
- **Frontend (`staging.fiduscan.com`):** Automated SSL/TLS certificates generated and managed by Vercel Let's Encrypt integration.
- **Backend (`api.staging.fiduscan.com`):** Configured Cloud Load Balancing with managed Google-managed SSL certificates to route traffic securely to the Cloud Run backend.

## Security Headers
The following security headers are enforced globally via Next.js middleware and FastAPI middleware:
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (HSTS)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy: default-src 'self'; img-src 'self' storage.googleapis.com; connect-src 'self' api.staging.fiduscan.com storage.googleapis.com;`

**Status: HTTPS SECURED AND VALIDATED**
