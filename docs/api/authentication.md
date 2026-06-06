# Authentication Guide

FiduScan API supports several methods of authentication to accommodate both automated integrations and user-facing applications.

## 1. API Keys (Recommended for Server-to-Server)

API keys are the preferred method for backend integrations. Include your API key in the `X-API-Key` header.

**Example:**
```bash
curl -X GET "https://api.fiduscan.io/v1/detect" \
  -H "X-API-Key: fs_live_abc123def456"
```

## 2. Bearer Tokens (For Client Applications)

For frontend applications or temporary access, use standard OAuth2 Bearer tokens obtained via SSO or direct login. Include the token in the `Authorization` header.

**Example:**
```bash
curl -X GET "https://api.fiduscan.io/v1/cases" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1..."
```

## 3. Organization Access

If a user or API key belongs to multiple organizations, you MUST specify the target organization ID using the `X-Organization-ID` header.

**Example:**
```bash
curl -X POST "https://api.fiduscan.io/v1/reports" \
  -H "X-API-Key: fs_live_abc123" \
  -H "X-Organization-ID: org_987654321"
```
