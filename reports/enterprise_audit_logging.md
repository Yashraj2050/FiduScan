# Phase 6A — Enterprise Audit Logging
*Generated: 2026-05-31 01:51 IST*

## Security & Compliance Tracking
Enterprise organizations require strict, immutable audit trails of all user activity for compliance (e.g., SOC2, ISO 27001).

### 1. The Audit Log Schema
A new immutable table `audit_logs` will be created with:
- `timestamp`: UTC datetime.
- `org_id`: The organization context.
- `actor_id`: The user or API key initiating the action.
- `action_type`: e.g., `SCAN_CREATED`, `USER_INVITED`, `API_KEY_REVOKED`.
- `target_resource`: The ID of the affected resource (e.g., the scan ID).
- `ip_address`: Originating IP.

### 2. Tracked Events
- **User Actions:** Login, logout, password resets, MFA enrollment.
- **Scan Actions:** Media uploads, scan executions, report downloads, false positive flagging.
- **Admin Actions:** Inviting members, changing roles, rotating API keys, updating billing.

### 3. Log Visibility
- Organization Owners and Admins can view and export the audit log via the Enterprise Dashboard.
- Audit logs are retained securely in the database for 1 year (configurable based on enterprise tier).

**Status: ENTERPRISE AUDIT LOGGING DESIGNED**
