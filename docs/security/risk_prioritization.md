# Risk Prioritization

## Overview
This document ranks the 10 critical security risks identified during the Phase 10A security audit based on severity (likelihood × impact) and selects the top 5 for immediate remediation in Phase 10A.1.

## All Identified Risks (Ranked)

1. **Secrets Management Sprawl (Critical):** Exposure of credentials in `.env` files or hardcoded keys.
2. **Upload Security (Critical):** Lack of malware scanning and strict limits on upload endpoints.
3. **JWT Token Weaknesses (Critical):** Long-lived tokens without strict rotation or invalidation mechanisms.
4. **Rate Limiting & Abuse Prevention (High):** Insufficient protection against DoS and brute-force attacks on APIs.
5. **Audit Logging Deficiency (High):** Lack of comprehensive, immutable audit trails for security events.
6. **Authorization & RLS (High):** Incomplete Row-Level Security policies leading to potential IDOR.
7. **File Validation (Medium):** Relying solely on MIME types instead of magic bytes.
8. **Security Headers (Medium):** Missing strict CSP, HSTS, and SRI headers on the frontend.
9. **Database Encryption at Rest (Medium):** Lack of Transparent Data Encryption (TDE).
10. **Model IP Protection (Low):** Need for enhanced obfuscation and inference protection.

## Selected Risks for Phase 10A.1

We will focus on the Top 5 risks:
1. Secrets Management
2. Upload Security
3. JWT Hardening
4. Rate Limiting & Abuse Prevention
5. Audit Logging
