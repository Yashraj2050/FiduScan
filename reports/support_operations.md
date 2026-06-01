# Phase 5D — Support Operations
*Generated: 2026-05-31 01:48 IST*

## Beta Tester Support Triage
To manage inquiries from the beta cohort effectively without overwhelming the engineering team, we have established a strict support workflow.

### 1. Level 1: Automated Self-Serve
- All beta testers are given access to `docs.fiduscan.com`, which explains known limitations (e.g., "Why does heavy WhatsApp compression confuse the image detector?").

### 2. Level 2: Community Triage
- Feedback submitted via the in-app widget is routed to Zendesk.
- Non-technical inquiries (account access, quota limits) are resolved using standard macro templates.

### 3. Level 3: Engineering Escalation
- **Critical Bugs:** (e.g., Cloud Run returning 500 errors, JWT login failures) are escalated directly to the on-call engineer via PagerDuty.
- **Model Inaccuracies:** Routed to the ML team's dispute bucket and closed in Zendesk with a message thanking the user for contributing to the model's accuracy.

**Status: SUPPORT OPERATIONS ESTABLISHED**
