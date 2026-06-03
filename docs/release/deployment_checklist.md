# v5.0 Deployment Checklist

## Pre-Deployment Verification
- [ ] Database Migrations: Ensure all SQLAlchemy schemas (Evidence, Hooks, Reviews, Keys) are propagated via Alembic to the production cluster.
- [ ] Environment Variables: Validate Polygon RPC URL, Stripe Live keys, and JWT Signing keys.
- [ ] Infrastructure: Ensure AWS/Railway worker nodes are scaled for expected launch volume.

## Deployment Sequence
- [ ] **Step 1:** Enable maintenance mode on UI (`fiduscan.com`).
- [ ] **Step 2:** Deploy Backend API to production workers.
- [ ] **Step 3:** Run `alembic upgrade head`.
- [ ] **Step 4:** Deploy Next.js v3.0 UI to Vercel.
- [ ] **Step 5:** Run synthetic end-to-end test (Embed -> Verify -> Chain -> Anchor).
- [ ] **Step 6:** Disable maintenance mode.

## Post-Deployment
- [ ] Verify Sentry/Datadog metric ingestion.
- [ ] Send Launch Announcement email via SendGrid.
