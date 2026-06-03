# Information Architecture

## Overview
This document designs the global Information Architecture (IA) for the upcoming FiduScan v3.0, organizing the backend capabilities into logical, user-friendly hierarchies.

## Core Nodes

### 1. The Investigation Hub
- **Scanner:** Real-time drag-and-drop interface for Deepfake detection across Image, Audio, and Video.
- **Verification:** Interface to check existing media for FiduScan watermarks.
- **Watermarking Engine:** Interface for embedding protective payloads into proprietary media.

### 2. Case Management (Enterprise)
- **Active Cases:** List of all open investigations.
- **Case Detail View:** 
  - Evidence Collection (Linked Reports & Hashes)
  - Investigator Notes Thread
  - Approval & Review Workflows
  - Export Bundle Generator

### 3. Analytics & Reporting
- **Authenticity Reports:** Searchable archive of generated forensic reports (PDF/JSON).
- **Evidence Chain:** Immutable logs showing the provenance of all scans and verifications.
- **Blockchain Explorer:** A lightweight viewer connecting local evidence hashes to Polygon transaction receipts.

### 4. Organization Settings
- **Billing & Usage:** Quota management, Stripe subscription portal.
- **Developer Portal:** API Key generation, webhook configuration, SDK documentation.
- **Team Management:** RBAC provisioning (Analyst, Reviewer, Approver).
