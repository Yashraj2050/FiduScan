# Incident Response Plan (Launch)

## 1. PagerDuty Escalation Path
- **Level 1 (On-Call Engineer):** Acknowledges alerts within 15 minutes. Triages severity.
- **Level 2 (Lead Engineer):** Escalated if the issue involves core inference pipelines, data corruption, or total platform downtime.
- **Level 3 (Founders):** Escalated if there is a security breach or PII data leak.

## 2. Severity Matrix
- **Sev-1 (Critical):** Platform inaccessible, database down, or security breach. Action: Immediate all-hands response. Update Statuspage.
- **Sev-2 (Major):** Specific core workflow (e.g., Watermarking or Scanning) failing for >10% of users. Action: Fix within 4 hours.
- **Sev-3 (Minor):** Non-critical UI bugs, delayed email delivery, minor latency. Action: Backlog for next sprint.

## 3. Communication Playbook
- **Internal:** Incident channel `#fiduscan-incidents` spun up automatically via integration.
- **External:** Status page updated dynamically. For Sev-1 incidents, a post-mortem is published to the engineering blog within 48 hours of resolution.
