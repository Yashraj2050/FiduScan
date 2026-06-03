# Rollback Procedure

## Overview
In the event of a catastrophic failure (e.g., data corruption, PII leakage, complete API unavailability) during the deployment of v3.3 Release Candidate, the following steps must be executed immediately.

## 1. Immediate Actions
1. **Routing:** Point Vercel domains (`fiduscan.com` and `api.fiduscan.com`) to a static "Under Maintenance" holding page to prevent further traffic ingress.
2. **Database Freeze:** Disable write access to the PostgreSQL database to halt potential data corruption.

## 2. Reversion Steps
1. **Frontend:** In Vercel, navigate to the Deployment History and trigger an "Instant Rollback" to the previous stable v2.9 UI commit.
2. **Backend:** In Railway, rollback the active deployment to the v2.9 container image.
3. **Database:** If database migrations caused corruption, execute `alembic downgrade -1` or restore from the automated pre-deployment point-in-time snapshot.

## 3. Post-Rollback
1. Validate system health on the reverted infrastructure.
2. Remove the "Under Maintenance" routing rule.
3. Notify beta testers of the outage via status page and email.
