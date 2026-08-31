# FiduScan — Railway Production Deployment Guide

**Version:** v9.0-timesformer-video  
**Last Updated:** 2026-06-11

---

## Pre-Deployment Checklist

> [!CAUTION]
> Complete ALL steps in this section before deploying. Skipping any step will cause the backend to crash on startup or silently malfunction.

### Step 0 — Rotate Exposed Secrets (CRITICAL)
The following credentials were committed to the repository and MUST be rotated before any public deployment:

| Secret | Where to Rotate |
|---|---|
| Supabase Service Key | Supabase Dashboard → Settings → API → Regenerate |
| Supabase DB Password | Supabase Dashboard → Settings → Database → Reset password |
| JWT_SECRET | Generate new: `openssl rand -hex 64` |

---

## Railway Environment Variables

Set ALL of the following in **Railway → Project → Variables**:

### Required (App will crash without these)

```bash
# Database
DATABASE_URL=postgresql://postgres:<NEW_PASSWORD>@db.mujexryfagomctgjqzpw.supabase.co:5432/postgres
SUPABASE_URL=https://mujexryfagomctgjqzpw.supabase.co
SUPABASE_SERVICE_KEY=<regenerated_service_key>
SUPABASE_ANON_KEY=<anon_key>

# JWT (rotate immediately — old key was exposed in git)
JWT_SECRET=<run: openssl rand -hex 64>

# CORS — comma-separated list of allowed frontend origins
CORS_ORIGINS=https://fiduscan.vercel.app,https://frontend-nu-ten-16.vercel.app
```

### Required for Billing Features

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://fiduscan.vercel.app
```

### Required for Email Features

```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=FiduScan <noreply@fiduscan.com>
```

### Required for Blockchain Features

```bash
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/<your-key>
POLYGON_PRIVATE_KEY=0x...
```

### Required for File Storage

```bash
R2_ENDPOINT_URL=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<r2-access-key>
R2_SECRET_ACCESS_KEY=<r2-secret-key>
R2_BUCKET_NAME=fiduscan-prod
```

### Optional / Recommended

```bash
# Sentry error monitoring
SENTRY_DSN=https://...@sentry.io/...

# Railway auto-injects this — used by health endpoint
RAILWAY_ENVIRONMENT=production
```

---

## Deployment Steps

### 1. Connect Repository to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project (or create new)
railway link
```

### 2. Set Environment Variables

```bash
# Set all variables from the list above
railway variables set DATABASE_URL="postgresql://..." JWT_SECRET="..."
# ... repeat for all required vars
```

### 3. Deploy

```bash
# From project root (FiduScan/)
railway up
```

Railway will use the `railway.json` configuration to:
- Build the Dockerfile at the repo root
- Run: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
- Health check: `GET /api/v1/ping` (returns 200 immediately)

### 4. Verify Deployment

```bash
# Replace with your Railway-generated URL
RAILWAY_URL=https://fiduscan-backend-production.up.railway.app

# Liveness check
curl $RAILWAY_URL/api/v1/ping
# Expected: {"status":"ok"}

# Full health check
curl $RAILWAY_URL/api/v1/health
# Expected: JSON with database_connected=true

# API docs
open $RAILWAY_URL/api/docs
```

### 5. Stripe Webhook Configuration

In Stripe Dashboard → Developers → Webhooks:

```
Endpoint URL: https://fiduscan-backend-production.up.railway.app/api/v1/billing/webhook
Events to listen for:
  - checkout.session.completed
  - invoice.paid
  - customer.subscription.deleted
```

Copy the webhook signing secret → set as `STRIPE_WEBHOOK_SECRET` in Railway.

---

## Startup Boot Sequence

When Railway starts the backend, the following happens in order:

1. **Imports** — All routers imported (no crash if Stripe/Resend keys missing)
2. **JWT check** — `JWT_SECRET` validated at startup → crash if missing
3. **DB init** — `models.Base.metadata.create_all()` runs (safe: creates tables if missing)
4. **Image model** — `InferenceService.load_models()` → loads Swin from HuggingFace
5. **Audio model** — `AudioInferenceService.load_model()` → loads EfficientNet from `models/audio/`
6. **Video model** — `VideoInferenceService.load_models()` → loads VideoMAE (non-fatal if missing)
7. **Health probe** → Railway calls `/api/v1/ping` → returns `200 OK`

> [!IMPORTANT]
> Model loading (steps 4-6) requires network access to HuggingFace Hub on first boot. Subsequent boots use Railway's ephemeral filesystem cache. Health check timeout is set to **300 seconds** to accommodate this.

---

## Dockerfile Notes

The root `Dockerfile` runs from the repo root:

```dockerfile
CMD cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

This is correct for Railway. The `railway.json` overrides this with workers and keep-alive settings.

---

## Monitoring After Deploy

| Check | URL |
|---|---|
| Liveness | `GET /api/v1/ping` |
| Full Health | `GET /api/v1/health` |
| API Docs | `GET /api/docs` |
| Railway Logs | `railway logs --tail` |

---

## Known Limitations (Post-Deployment Fixes Needed)

| Issue | Impact | Fix |
|---|---|---|
| Video AI uses dummy random tensors | Video detection non-functional | Train/download TimeSformer, populate `models/video/` |
| Audio model has mock fallback | Silent false results if model fails | Remove `if self.model is None` fallback |
| Blockchain router returns fake TX hashes | Chain anchoring non-functional | Wire `blockchain_service.py` to router |
| No Sentry integration | Zero error visibility | Add `sentry-sdk[fastapi]` + `SENTRY_DSN` |
| R2 storage unconfigured | Evidence upload fails silently | Provision R2 bucket + set 4 env vars |
| Email from-domain unverified | Emails may be rejected/spam | Verify `fiduscan.com` domain in Resend |
