# Phase 5A — Database Productionization
*Generated: 2026-05-30 19:39 UTC*

## Migration Plan (SQLite to Managed PostgreSQL)
The current SQLite setup (via SQLAlchemy) will be migrated to GCP Cloud SQL (PostgreSQL).

1. **Schema Generation**: Alembic will generate the initial Postgres migrations.
2. **Connection Pooling**: PgBouncer will be configured in front of Cloud SQL to handle massive connection spikes from Cloud Run scaling out.
3. **Backups**: Automated daily snapshots + Point-in-Time-Recovery (PITR) enabled.

