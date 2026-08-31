# FiduScan - Platform Context & Architecture

This document provides a comprehensive overview of the FiduScan project. It is intended for future developers, AI agents, contributors, recruiters, and maintainers to instantly understand the system architecture, business logic, and production state.

---

## 1. Executive Summary
FiduScan is an AI-Powered Digital Media Authenticity & Forensic Intelligence Platform. It provides enterprise-grade tools to analyze images, audio, and video for AI generation, deepfakes, and synthetic manipulation. By combining state-of-the-art neural networks with verifiable cryptographic chain-of-custody, FiduScan delivers explainable, legally defensible forensic evidence for trust and safety teams, legal professionals, and media organizations.

## 2. Business Problem
With the proliferation of generative AI, the digital trust landscape is breaking down. Organizations face severe risks from synthetic media, including political disinformation, insurance fraud, identity theft, and IP infringement. Traditional moderation tools cannot detect subtle artifacts left by diffusion models and GANs, creating a critical need for multimodal forensic intelligence.

## 3. Product Vision
To be the foundational layer of truth for the internet. FiduScan aims to provide an API-first, mathematically provable verification system that not only detects deepfakes but also provides cryptographic guarantees for authentic media, restoring trust in digital communications.

## 4. Current Project Status
- **Status:** Release Candidate (Beta)
- **Deployment:** Vercel (Frontend), Railway (Backend)
- **Core Functionality:** Active
- **Phase:** Pre-Launch Validation Complete

## 5. Production Readiness Status
- **Score:** 9/10
- **Critical Findings:** 0 (Blockers mitigated)
- **High Findings:** 1 (Deferred - Global Audit Logging)
- **Launch Recommendation:** GO (Beta/Free Tier)

---

## 6. Complete Architecture Overview
FiduScan uses a decoupled, microservices-oriented architecture:
- **Client Layer:** Next.js React application (Server-Side Rendered and statically generated).
- **API Gateway/Backend:** FastAPI Python service providing RESTful endpoints.
- **Data Layer:** PostgreSQL (via Supabase) for relational data and Supabase Storage for blob objects.
- **Inference Layer:** PyTorch/HuggingFace models running within the backend context.

## 7. Frontend Architecture
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Vanilla CSS (CSS Modules / Global vars)
- **State Management:** React Hooks + Context
- **Deployment:** Vercel Edge Network
- **Key Characteristics:** Minimalist, premium dark-mode aesthetic with micro-animations and responsive components.

## 8. Backend Architecture
- **Framework:** FastAPI + Python 3.10+
- **Architecture:** Controller-Service-Repository pattern.
- **Concurrency:** Asyncio for non-blocking I/O operations.
- **Deployment:** Dockerized container deployed on Railway.
- **Key Characteristics:** High-throughput API, swagger documentation auto-generated, lazy-loaded ML models.

## 9. Database Architecture
- **Provider:** PostgreSQL (Supabase)
- **ORM:** SQLAlchemy
- **Schema:** Relational schema including `users`, `cases`, `evidence_records`, `custody_events`, `reports`, and `usage_tracking`.
- **Security:** Row Level Security (RLS) is deferred to backend application logic.

## 10. Storage Architecture
- **Provider:** Supabase Storage (Migrated from Cloudflare R2)
- **Buckets:** `evidence` (raw media uploads) and `reports` (generated PDF forensics).
- **Access:** Signed URLs with expiring access tokens for strict access control.

## 11. Authentication Architecture
- **Provider:** Supabase Auth (JWT)
- **Integration:** API token validation via FastAPI dependency injection (`Depends(get_current_user)`).
- **SSO:** Configured for Enterprise SSO integrations.
- **API Keys:** Dedicated API keys generated via `secrets.token_hex` for developer access.

---

## 12. AI Systems Architecture
The AI inference engine is built on PyTorch and HuggingFace Transformers, utilizing specialized models for different modalities. Models are lazy-loaded into memory upon first request to ensure fast API startup and health check readiness.

## 13. Image Detection System
- **Status:** Active
- **Model:** ViT/ResNet ensemble (e.g., DFDC-trained models).
- **Pipeline:** Preprocessing, inference, heatmap generation, and authenticity scoring.

## 14. Audio Detection System
- **Status:** Active
- **Model:** Wav2Vec2/Audio Spectrogram Transformer variants.
- **Pipeline:** Waveform extraction, mel-spectrogram analysis, and deepfake voice detection.

## 15. Video Detection System Status
- **Status:** Disabled / Deferred (Coming Soon)
- **Reason:** Requires heavy `ffmpeg` processing and specialized TimeSformer models which exceed current MVP server constraints. Endpoints return HTTP 501.

---

## 16. Evidence Management Workflow
1. User creates an Investigation Case.
2. Media uploaded to Supabase Storage via backend.
3. Media hashed (SHA-256) upon ingestion.
4. AI Inference runs, producing authenticity scores.
5. Evidence record saved to PostgreSQL.

## 17. Chain of Custody Workflow
1. Every action (upload, analyze, view, export) is logged.
2. Evidence is cryptographically hashed.
3. Hashes are verified upon retrieval to guarantee zero tampering (`evidence_chain.py`).

## 18. Forensic Reporting Workflow
1. User requests a report.
2. Backend aggregates AI metadata, heatmaps, and custody logs.
3. PDF report generated (or JSON generated).
4. Report is cryptographically signed (SHA-256) to ensure legal validity.

## 19. Collaboration Features
- **Status:** Active
- **Features:** Shared team workspaces, role-based access control (RBAC), and case sharing links.

## 20. Enterprise Features
- White-labeling (custom branding on reports).
- Custom SLAs and bulk export capabilities (ZIP streaming).
- Webhook notifications for asynchronous processing.

## 21. API Architecture
- RESTful JSON API.
- Live Swagger UI at `/docs`.
- Versioned endpoints (e.g., `/api/v1/...`).

## 22. Security Architecture
- **Webhooks:** Cryptographically signed payloads (`whsec_...`).
- **Data in transit:** TLS 1.3 enforced.
- **Data at rest:** Encrypted by Supabase.
- **Secrets:** Environment variables strictly segregated from source code.
- **Integrity:** SHA-256 hashing for all evidentiary artifacts.

## 23. Deployment Architecture
- **Frontend:** Vercel (CI/CD connected to GitHub `main` branch).
- **Backend:** Railway (Docker container, auto-scaling).
- **Database/Storage:** Supabase Cloud.

## 24. Environment Variables
Required variables for production:
- `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `STRIPE_SECRET_KEY` (Pending)
- `JWT_SECRET`

## 25. Third Party Integrations
- **Resend:** Transactional emails (invites, receipts).
- **Stripe:** Billing and usage quotas.
- **Supabase:** Auth, DB, Storage.

---

## 26. Current Production State
The platform is operational for Image and Audio analysis. Frontend and backend are successfully communicating in production. Email infrastructure is verified.

## 27. Deferred Features
- **Video AI Detection:** Pending infrastructure scale-up.
- **Blockchain Anchoring:** Pending Web3 gas fee optimization and smart contract audits.
- **Global Audit Logs Service:** Pending implementation.

## 28. Known Limitations
- Heavy concurrent traffic may bottleneck PyTorch inference on CPU/limited-GPU instances.
- Stripe webhooks currently require database sync completion.

---

## 29. Development Rules
- Verify functionality before completion.
- Do not introduce mocked data into production pathways.
- Maintain absolute separation between frontend presentation and backend business logic.

## 30. Coding Standards
- **Python:** PEP8, type hints (`typing`), Pydantic for data validation.
- **TypeScript:** Strict mode, interface definitions, React functional components.

## 31. Deployment Procedures
- All merges to `main` trigger Vercel deployment.
- Railway deployment triggered upon Dockerfile/Backend changes.
- Ensure environment variables are synced across Vercel and Railway before launch.

## 32. Testing Strategy
- Pytest for backend unit testing (mocking external APIs).
- Manual verification of inference pipelines before major releases.

## 33. Future Roadmap
1. Deploy dedicated GPU workers for Video AI processing.
2. Complete Stripe integration for automated tier upgrades.
3. Implement Ethereum/Polygon blockchain anchoring for immutable evidence.
4. Build comprehensive Global System Audit Logs for compliance.

---

## 34. Resume Summary
*FiduScan: AI-Powered Media Forensic Intelligence Platform*
Engineered a comprehensive multimodal AI platform to detect synthetic media and deepfakes. Architected a microservices stack using Next.js, FastAPI, and PostgreSQL. Integrated PyTorch/HuggingFace inference pipelines for image and audio analysis with sub-second latency. Implemented cryptographic chain-of-custody protocols for legal defensibility. Deployed on Vercel and Railway with Supabase for data and blob storage.

## 35. Portfolio Summary
**FiduScan** is an enterprise-grade trust and safety tool designed to combat the rise of generative AI manipulation. It features a premium, responsive UI connected to a high-throughput Python backend. Capabilities include AI inference, secure webhook integrations, verifiable forensic reporting, and role-based collaboration—all built with scalable, modern web technologies.

## 36. Maintainer Notes
- When scaling, move ML inference to a dedicated GPU microservice (e.g., Celery/Redis workers) to unblock the main FastAPI thread.
- Ensure API keys and webhook secrets are regularly rotated.
- Monitor Supabase storage costs as raw evidence ingestion scales.
