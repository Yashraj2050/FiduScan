# Supabase Migration Plan
*Generated: 2026-05-31 02:19 IST*

## Supabase Infrastructure Setup
Supabase will handle the relational database and object storage requirements, replacing Cloud SQL and GCS.

### 1. PostgreSQL Database
- **Provisioning:** Create a new project in the Supabase dashboard.
- **Migrations:** Retrieve the Supabase connection string (`postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`).
- **Execution:** Run `alembic upgrade head` using the Supabase URI to build the FiduScan schema.

### 2. Storage Buckets
- **Buckets:** Create two public buckets in the Supabase Storage dashboard: `quarantine` and `processed`.
- **Security:** Configure Row Level Security (RLS) policies allowing authenticated uploads (if using Supabase Auth) or restrict to service role keys (if handling uploads strictly through our FastAPI backend).

**Status: SUPABASE MIGRATION DESIGNED**
