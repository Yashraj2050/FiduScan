# Phase 5B — Database Staging Deployment
*Generated: 2026-05-31 01:35 IST*

## Cloud SQL Provisioning
The PostgreSQL relational database has been deployed to the staging environment, strictly adhering to the Phase 5A migration design.

* **Instance ID:** `fiduscan-db-staging`
* **Engine:** PostgreSQL 15
* **Machine Type:** `db-custom-2-8192` (2 vCPUs, 8 GB RAM)
* **Storage:** 50 GB SSD with automatic storage increase enabled.
* **Network:** Private IP only (`vpc-staging`). Public IP disabled for security.

## Configuration Details

### 1. Migrations Applied
Alembic was executed via an ephemeral migration job attached to the VPC.
- Applied revision `head` (auth users, upload metadata, audit logs).
- Schema integrity verified.

### 2. Backups & High Availability
- **Automated Backups:** Enabled daily between 02:00 - 04:00 UTC.
- **Point-in-Time Recovery (PITR):** Enabled with 7 days of Write-Ahead Log (WAL) retention.
- **High Availability:** Disabled for the staging environment to optimize costs (will be enabled in Production).

### 3. Connection Pooling
- Configured **PgBouncer** inside the Cloud Run backend container to prevent connection exhaustion.
- Maximum DB connections set to 100.

**Status: DATABASE DEPLOYED AND MIGRATED**
