# Phase 6A — Team Workspaces
*Generated: 2026-05-31 01:50 IST*

## Shared Operational Environments
Enterprise clients require shared contexts where analysts can collaborate on forensic results.

### 1. Shared Scans
- The `scans` table will be updated to include an `org_id` foreign key.
- When an Analyst executes a scan, the result is immediately visible on the shared Organization Dashboard for all members (Admins, Analysts, Viewers) to review.

### 2. Shared Reports & Annotations
- Analysts can attach textual notes to a scan result (e.g., "Confirmed Deepfake by Editorial Team").
- Users can generate and share PDF reports of the forensic findings directly from the workspace.

### 3. Visibility Controls
- By default, all scans within an organization are visible to all members of that organization.
- Private scans (tied strictly to the `user_id` and not the `org_id`) will remain available for individual accounts not linked to a team.

**Status: TEAM WORKSPACES DESIGNED**
