# v5.0 Rollback Checklist

## Conditions for Rollback
- Database migration fails to apply cleanly on the production cluster.
- P0 Security Breach (e.g., cross-tenant data leakage in Enterprise Cases).
- Critical API failure (> 10% 5xx errors) sustained for > 5 minutes.

## Rollback Execution Sequence
- [ ] **Step 1:** Enable maintenance mode (`fiduscan.com`).
- [ ] **Step 2:** Scale down Backend API worker nodes.
- [ ] **Step 3:** Database Downgrade: Run `alembic downgrade base` or restore from the automated pre-launch AWS snapshot to clear v5 schemas.
- [ ] **Step 4:** Revert Vercel deployment to the last stable `v4.1` UI commit via Vercel instant rollback.
- [ ] **Step 5:** Deploy `v4.1` Backend API image to Railway workers.
- [ ] **Step 6:** Run `v4.1` synthetic tests to ensure stability.
- [ ] **Step 7:** Disable maintenance mode.

## Post-Rollback
- [ ] Update StatusPage with post-mortem details.
- [ ] Alert enterprise beta testers of the delay via email.
