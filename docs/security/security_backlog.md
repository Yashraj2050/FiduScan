# Security Backlog

## Overview
This document tracks the security risks and enhancements that were identified during the Phase 10A security audit but deferred from Phase 10A.1 to subsequent sprints.

## Deferred Items (Phase 10A.2+)

### 1. Authorization & Row-Level Security (RLS)
- **Description:** Implement comprehensive RLS policies on the database to prevent Insecure Direct Object References (IDOR).
- **Severity:** High
- **Action:** Define granular policies tied directly to user identities in the JWT claims.

### 2. Deep File Validation
- **Description:** Move beyond basic MIME type checking and implement deep file validation.
- **Severity:** Medium
- **Action:** Implement magic byte validation and Content Disarm and Reconstruction (CDR) for all media uploads.

### 3. Frontend Security Headers
- **Description:** Missing strict security headers on the frontend delivery.
- **Severity:** Medium
- **Action:** Configure Web Application Firewall (WAF) or CDN to enforce strict Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), and Subresource Integrity (SRI).

### 4. Database Encryption at Rest
- **Description:** Enforce encryption for PII stored in the database.
- **Severity:** Medium
- **Action:** Enable Transparent Data Encryption (TDE) on the database layer.

### 5. Intellectual Property Protection
- **Description:** Further protect model and frontend source code.
- **Severity:** Low (as models are entirely server-side)
- **Action:** Obfuscate frontend source code, remove source maps from production, and add output perturbation to model inference APIs.
