# Phase 4B — Authentication Architecture
*Generated: 2026-05-30 19:23 UTC*

## Identity Provider
FiduScan uses a bespoke Email/Password provider for the MVP.
- **Passwords**: Bcrypt hashing via `passlib`.
- **Tokens**: JWT (JSON Web Tokens) encoded via `HS256`.

## OAuth Readiness
The `users` table schema supports future columns like `google_id` or `github_id` for seamless SSO integration in Phase 5.

## Flow
1. Client sends `POST /api/v1/auth/login` (or `/register`).
2. Server returns `access_token` (valid for 30m).
3. Client attaches `Authorization: Bearer <token>` to all `POST /api/v1/*/detect` calls.
4. Server rejects invalid/expired tokens with `401 Unauthorized`.
