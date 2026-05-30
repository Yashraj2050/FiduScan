# Phase 5A — Secrets Management
*Generated: 2026-05-30 19:39 UTC*

## Strategy
All plaintext `.env` files will be excluded from production. 
We will utilize **Google Secret Manager**.

Secrets to vault:
1. `DATABASE_URL` (Postgres connection string)
2. `JWT_SECRET_KEY`
3. `API_KEYS` (Third-party integrations, if any)

Cloud Run will inject these secrets into the environment variables at startup securely.

