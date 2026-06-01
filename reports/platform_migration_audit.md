# Deployment Platform Migration Audit
*Generated: 2026-05-31 02:19 IST*

## Platform Shift Assessment
Moving from Google Cloud Platform to Vercel (Frontend), Railway (Backend), and Supabase (Database + Storage) requires adjusting several deployment components.

### 1. Frontend (Vercel)
- The Next.js frontend is already prepared for Vercel. 
- Minimal changes required. Environment variables must point to the new Railway backend URL.

### 2. Backend (Railway)
- The FastAPI backend is fully Dockerized. Railway natively supports deploying from a `Dockerfile`.
- The primary constraint will be the RAM required to hold EfficientNet, Wav2Vec2, and Whisper in memory. A Railway Pro tier with at least 8GB RAM is required.

### 3. Database (Supabase PostgreSQL)
- Supabase is standard PostgreSQL under the hood. Our Alembic migrations will run natively without modification.

### 4. Storage (Supabase Storage)
- Supabase Storage replaces Google Cloud Storage.
- We must modify the backend's storage adapter (which likely uses `google-cloud-storage`) to use the `supabase-py` client or standard S3-compatible APIs for uploading media to the `quarantine` and `processed` buckets.

**Status: AUDIT COMPLETE**
