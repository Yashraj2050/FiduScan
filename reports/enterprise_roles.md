# Phase 6A — Enterprise Role Expansion (RBAC)
*Generated: 2026-05-31 01:50 IST*

## Role-Based Access Control (RBAC)
Within an organization, team members will have scoped permissions to ensure data security and operational safety.

### 1. Owner
- **Scope:** Full control.
- **Permissions:** Manage billing, delete the organization, revoke API keys, manage all team members, and view all scans.

### 2. Admin
- **Scope:** Operational management.
- **Permissions:** Invite/remove Analysts and Viewers, rotate API keys, configure webhooks, view all scans. Cannot modify billing or delete the organization.

### 3. Analyst
- **Scope:** Core operational use.
- **Permissions:** Upload media for scanning, view all team scans, flag false positives, generate PDF reports. Cannot manage users or API keys.

### 4. Viewer
- **Scope:** Read-only access.
- **Permissions:** View scan results and reports. Cannot execute new scans or modify any data.

**Status: ROLE EXPANSION COMPLETED**
