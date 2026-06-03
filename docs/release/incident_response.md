# v5.0 Incident Response Plan

## Monitoring & Alerting
- **Uptime Monitoring:** Datadog synthetics running every 1 minute against `/api/v1/health`.
- **Error Tracking:** Sentry captures all unhandled exceptions in FastAPI and Next.js.
- **Alert Routing:** PagerDuty escalates Sev-1 and Sev-2 alerts to the on-call engineer's phone.

## Severity Definitions
### Sev-1 (Critical)
- **Definition:** Total platform outage, API inaccessible, or data breach.
- **Response:** All-hands. Lead Engineer triages. Statuspage updated immediately.
- **Goal:** Resolution < 2 hours.

### Sev-2 (Major)
- **Definition:** Specific core feature (e.g., Blockchain Anchoring or PDF Reports) is consistently failing.
- **Response:** On-call engineer assigns to relevant domain owner.
- **Goal:** Resolution < 4 hours.

### Sev-3 (Minor)
- **Definition:** UI glitches, slow loading times, isolated webhook delivery failures.
- **Response:** Logged in Jira for the next sprint triage.
- **Goal:** Resolution < 1 week.

## Post-Incident Procedures
- A mandatory internal Post-Mortem document must be written for all Sev-1 and Sev-2 incidents within 48 hours, detailing the root cause, timeline, and remediation items to prevent recurrence.
