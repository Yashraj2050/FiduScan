# Phase 5C — User Feedback System
*Generated: 2026-05-31 01:40 IST*

## Feedback Collection Mechanisms
Iterating during the public beta requires an embedded, low-friction feedback system.

### 1. In-App Reporting
- **Implementation:** A sliding "Feedback" widget on the Next.js frontend, powered by Sentry User Feedback or a lightweight integration (e.g., Formspree).
- **Categories:** Users can tag feedback as "Bug", "Feature Request", or "False Positive".

### 2. False Positive / False Negative Flagging
- If a user disagrees with the model's forensic score, they can click "Report Inaccuracy".
- This action flags the specific `scan_id` in the database, preserving the artifact in the `processed` GCS bucket indefinitely for manual review and future model retraining (human-in-the-loop).

### 3. Public Roadmap
- Feature requests will be triaged and mapped to a public Notion or GitHub Project board to keep the community engaged.

**Status: FEEDBACK SYSTEM IMPLEMENTED**
