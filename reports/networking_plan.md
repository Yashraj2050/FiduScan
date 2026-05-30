# Phase 5A — HTTPS & Domain Plan
*Generated: 2026-05-30 19:39 UTC*

## Routing Architecture
- **Staging**: `staging.api.fiduscan.com`
- **Production**: `api.fiduscan.com`

## TLS and Certificates
Managed Certificates via Cloud Load Balancing. HTTPS is strictly enforced; HTTP traffic will automatically `301 Redirect` to HTTPS.

