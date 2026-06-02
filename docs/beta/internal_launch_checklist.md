# Internal Beta Launch Checklist

This checklist is for the FiduScan engineering and product teams to ensure all systems are green before dispatching the beta invitations.

## 1. Infrastructure Validation
- [ ] Verify Vercel production deployment is `READY` and healthy.
- [ ] Verify FastAPI backend on Render/AWS is `READY` and healthy.
- [ ] Run end-to-end synthetic health check on the `/api/v1/detect` endpoint.
- [ ] Verify SQLite/PostgreSQL database backups are enabled.

## 2. Stripe & Billing Validation
- [ ] Verify Stripe is strictly in **TEST MODE**.
- [ ] Confirm Webhook signing secret (`STRIPE_WEBHOOK_SECRET`) is correctly configured in the backend environment variables.
- [ ] Manually test a Free -> Pro upgrade flow using a Stripe test card (e.g., `4242...`) to ensure Webhooks trigger DB updates.

## 3. Communication Channels
- [ ] `#fiduscan-beta-squad` Slack channel created and permissions set.
- [ ] `beta-support@fiduscan.com` inbox routed to the triage team.
- [ ] Jira `BETA-FR` epic created for feature tracking.
- [ ] Jira `BETA-BUG` epic created for bug tracking.

## 4. Documentation Readiness
- [ ] `beta_tester_guide.md` exported to PDF.
- [ ] `feedback_template.md` exported to PDF/Form.
- [ ] `api_documentation.md` pushed to the Developer Portal UI.
- [ ] Demo video uploaded and linked in the landing page hero.

## 5. Launch Execution (GO/NO-GO)
- [ ] Final GO/NO-GO meeting held.
- [ ] Marketing posts (LinkedIn, Twitter, Discord) published.
- [ ] Email invitations dispatched to the initial 20 testers.
- [ ] System monitor alerts (DataDog/Sentry) active and routing to the engineering team.
