# Authentication Verified Checkpoint — v1.7.2

**Date:** 2026-06-03  
**Release Tag:** `v1.7.2-authentication-verified`  
**Status:** ✅ PRODUCTION VERIFIED

---

## Incident Summary

After deploying the FiduScan frontend to `https://frontend-nu-ten-16.vercel.app`, browser requests
to the Railway backend (`https://fiduscan-backend-production.up.railway.app`) were failing with:

```
OPTIONS /api/v1/auth/register → 400 Bad Request
Failed to fetch
```

Registration and login were completely broken from the new frontend origin. Four root causes were
identified and resolved in sequence during the incident.

---

## Fix 1 — CORS: Missing Frontend Origin in `CORS_ORIGINS`

**Commit:** `d47ca0c`  
**File:** `backend/main.py`  
**Classification:** Environment Issue (C) + Code Issue (A)

### Root Cause
The Railway environment variable `CORS_ORIGINS` was set to `http://localhost:3000` only, which
overrides the application code default entirely. The new frontend origin
`https://frontend-nu-ten-16.vercel.app` was never in the allowed list.

### Changes Applied

**Railway environment variable updated via CLI:**
```
CORS_ORIGINS=http://localhost:3000,https://fiduscan.vercel.app,https://frontend-nu-ten-16.vercel.app
```

**`backend/main.py` fallback default updated:**
```python
# Before
ALLOWED_ORIGINS = os.environ.get(
    "CORS_ORIGINS", "http://localhost:3000,https://fiduscan.vercel.app"
).split(",")

# After
ALLOWED_ORIGINS = os.environ.get(
    "CORS_ORIGINS", "http://localhost:3000,https://fiduscan.vercel.app,https://frontend-nu-ten-16.vercel.app"
).split(",")
```

### CORSMiddleware Configuration (verified)
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,   # All 3 origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
    max_age=600,
)
```

---

## Fix 2 — Stripe: Missing from `backend/requirements.txt`

**Commit:** `424a9ca`  
**File:** `backend/requirements.txt`  
**Classification:** Deployment Issue (B)

### Root Cause
`backend/routers/billing.py` imports `stripe` at the top level. The `stripe` package was never
added to `backend/requirements.txt`, causing a `ModuleNotFoundError` at startup. This was a
pre-existing crash that was first surfaced when the CORS fix triggered a fresh Railway build.

### Change Applied
```diff
# backend/requirements.txt
+stripe==10.12.0
```

---

## Fix 3 — Railway: Root `requirements.txt` Was the Actual Install Target

**Commit:** `40febcd`  
**File:** `requirements.txt` (repo root)  
**Classification:** Deployment Issue (B) — Critical

### Root Cause
Railway's Nixpacks builder scans for `requirements.txt` starting from the **repository root**.
Because a root-level `requirements.txt` existed (a copy of `backend/requirements.txt` without
`stripe`), Nixpacks installed from the root file and completely ignored `backend/requirements.txt`.
Fix 2 added `stripe` to the wrong file, so the crash persisted across multiple deploys.

### Change Applied
```diff
# requirements.txt (REPO ROOT — this is what Railway actually reads)
+stripe==10.12.0
```

### Key Lesson
When a monorepo contains a `requirements.txt` at root AND inside a subdirectory, Railway Nixpacks
**always prefers the root file**. Both files must be kept in sync, or a single authoritative root
file should be used with a `nixpacks.toml` specifying `buildCommand`.

---

## Fix 4 — ai_engine: Broken Symlink Not Tracked in Git

**Commit:** `a275d9f`  
**Files:** `ai_engine/__init__.py`, `ai_engine/model.py`, `ai_engine/explainability.py`  
**Classification:** Deployment Issue (B)

### Root Cause
`backend/services/inference_service.py` imports `from ai_engine.model import build_model, get_model`.
Locally, `ai_engine/` was a symlink pointing to `./ai-engine/`. Git does not follow symlinks that
point to directories — the symlink itself was never committed to the repository. On Railway, no
`ai_engine/` directory existed, which would have caused a `ModuleNotFoundError` at lifespan startup
(after stripe was resolved).

### Change Applied
- Removed the broken symlink `ai_engine → ./ai-engine`
- Created real directory `ai_engine/` with all three source files copied from `ai-engine/`
- Committed `ai_engine/__init__.py`, `ai_engine/model.py`, `ai_engine/explainability.py`

---

## Vercel Fix

**No code changes required.**  
The Vercel frontend at `https://frontend-nu-ten-16.vercel.app` was already correctly configured
to call `https://fiduscan-backend-production.up.railway.app`. The `Failed to fetch` browser error
was entirely caused by the backend CORS rejection (Fix 1). Once the backend allowed the origin,
Vercel requests succeeded without any Vercel-side changes.

---

## Verification Results

All checks run against live production after build `573b55d9` deployed:

| Check | Command / Method | Result |
|-------|-----------------|--------|
| **OPTIONS preflight — `frontend-nu-ten-16`** | `curl -X OPTIONS` with origin header | `HTTP/2 200` ✅ |
| **OPTIONS preflight — `fiduscan.vercel.app`** | `curl -X OPTIONS` with origin header | `HTTP/2 200` ✅ |
| **`access-control-allow-origin`** | Response header inspection | Correct origin echoed ✅ |
| **`access-control-allow-credentials`** | Response header inspection | `true` ✅ |
| **Health endpoint** | `GET /api/v1/health` | `{"status":"operational","model_loaded":true}` ✅ |
| **Register** | `POST /api/v1/auth/register` | `200 OK`, user created ✅ |
| **Login** | `POST /api/v1/auth/login` (form-encoded) | `200 OK`, JWT token returned ✅ |

---

## Commit History (This Incident)

| Commit | Description |
|--------|-------------|
| `d47ca0c` | fix(cors): add frontend-nu-ten-16.vercel.app to allowed origins fallback |
| `424a9ca` | fix(deps): add stripe to requirements.txt — fixes Railway startup crash |
| `a275d9f` | fix(deps): replace ai_engine symlink with real directory |
| `40febcd` | fix(deps): add stripe to ROOT requirements.txt — Railway nixpacks reads root, not backend/ |

---

## Production Endpoints (Verified)

| Service | URL | Status |
|---------|-----|--------|
| Backend (Railway) | `https://fiduscan-backend-production.up.railway.app` | ✅ Online |
| Frontend (Vercel) | `https://frontend-nu-ten-16.vercel.app` | ✅ Online |
| Frontend (Vercel primary) | `https://fiduscan.vercel.app` | ✅ Online |
| API Docs | `https://fiduscan-backend-production.up.railway.app/api/docs` | ✅ Online |
