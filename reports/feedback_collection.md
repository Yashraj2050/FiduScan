# Phase 5D — Feedback Collection Mechanisms
*Generated: 2026-05-31 01:46 IST*

## Integrated Feedback Architecture
Gathering structured and actionable feedback is the primary goal of the external beta.

### 1. In-App Bug Reports & Feature Requests
- A persistent "Feedback" button resides in the application header.
- Submissions are piped directly to an internal Trello/Jira board.
- Submissions automatically capture the user's browser agent, OS, and the ID of their most recent scan to provide context for debugging.

### 2. Model Accuracy Feedback (False Positives/Negatives)
- On every completed scan result page, users are prompted: *"Do you agree with this assessment? [Yes] [No]"*.
- Clicking "No" triggers a modal asking the user to provide context (e.g., "This is a real photo of my cat, not AI").
- These disputed artifacts are securely moved to a `disputed-artifacts` GCS bucket for human review by the FiduScan team.

### 3. User Surveys
- An automated survey will be emailed to users 7 days after their first scan to assess general UX satisfaction and identify friction points.

**Status: FEEDBACK COLLECTION IMPLEMENTED**
