# Enterprise Release
*Release Date: 2026-06-02*

## Enterprise Features Implemented
- **Organizations**: Implemented organization creation, membership, and ownership models.
- **RBAC**: Implemented role-based access control (Owner, Admin, Analyst, Viewer).
- **Team Workspaces**: Added workspace creation, membership, and isolation.
- **API Keys**: Added generation, hashing, rotation, and revocation for programmatic access.
- **Enterprise Audit Logs**: Implemented tracking for login events, role changes, scan activity, and API key usage.
- **Async Processing**: Implemented queue-based execution for large video scans and batch jobs.

## Migration Summary
- **Count**: 1 new database migration (`001_enterprise.sql`).
- **Changes**: Created `organizations`, `organization_members`, `workspaces`, and `api_keys` tables.

## API Endpoint Summary
- **Count**: 3 new endpoints added.
- **Details**: Added routers for `/organizations`, `/workspaces`, and `/api_keys`.

## Deployment Status
- **Status**: ENTERPRISE_READY
- **Milestone**: v1.3-enterprise-ready
- **Validation**: Passed all tests (5 new enterprise tests).
