# Navigation Architecture

## Primary Navigation Structure

The v3.0 platform utilizes a persistent left sidebar containing the primary navigation routes, optimized for quick access to distinct forensic and administrative contexts.

### 1. Dashboard
- Overview of recent platform activity.
- Entry point for users logging in.

### 2. Investigations
- Nested list view of Cases (Active, Closed, Pending Review).
- Direct access to the Investigation Workspace.

### 3. Evidence
- Central vault of all uploaded and verified media.
- Quick search by File Hash, Evidence ID, or Watermark ID.

### 4. Watermarking
- Engine interface for embedding watermarks into proprietary assets.
- Verification interface to test assets for existing watermarks.

### 5. Reports
- Archive of generated forensic JSON and PDF reports.

### 6. Developer Portal
- API Key management and provisioning.
- Webhook configuration for async scanning.
- Interactive API documentation (Swagger UI embedded).

### 7. Billing
- Quota usage metrics and Stripe subscription tier management.

### 8. Settings
- User Profile, MFA configuration, and Team Role management.
