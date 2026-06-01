# Secret Management Plan
*Generated: 2026-05-31 02:20 IST*

## Deployment Environment Variables
Migrating to Railway and Supabase requires securely injecting the following secrets into the production environments.

### 1. Railway Secrets (Backend)
- `DATABASE_URL`: Supabase Transaction Pooler URI (`postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`)
- `SUPABASE_URL`: The Supabase project URL (`https://[project].supabase.co`)
- `SUPABASE_SERVICE_KEY`: The secret service role key for bypassing RLS during backend storage operations.
- `JWT_SECRET`: A secure 256-bit secret key for signing authentication tokens.
- `CORS_ORIGINS`: `https://fiduscan.com,https://staging.fiduscan.com`

### 2. Vercel Secrets (Frontend)
- `NEXT_PUBLIC_API_URL`: The public Railway URL for the backend.
- `NEXT_PUBLIC_SUPABASE_URL`: The Supabase project URL (if frontend uploads directly to buckets).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The public anonymous key.

**Status: SECRET MANAGEMENT DEFINED**
