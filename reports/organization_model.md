# Phase 6A — Enterprise Organization Model
*Generated: 2026-05-31 01:50 IST*

## B2B Multi-Tenant Architecture
To support enterprise clients, the database schema must evolve from a flat user model to a multi-tenant structure.

### 1. Database Schema
- **`organizations` Table:** Contains `org_id`, `name`, `billing_id`, and `created_at`.
- **`organization_users` Table (Join Table):** Maps `user_id` to `org_id` with a specific `role_id`.

### 2. Tenant Isolation
- A user can belong to multiple organizations but must select an "Active Organization" context upon login.
- All API requests and database queries (e.g., fetching scans) must be strictly scoped using a `WHERE org_id = :current_org_id` clause.
- Global queries across organizations are prohibited except for system superadmins.

**Status: ORGANIZATION MODEL DESIGNED**
