# Project Context — FiduScan

**Platform**: AI-Generated Image Forensic Detection
**Status**: Phase 1 MVP Complete & Validated. Transitioning to Phase 2.
**Goal**: Identify AI-generated vs. Authentic images with cryptographic evidence tracking, zero-trust backend, and a modern Next.js frontend.

## Architecture
1. **Frontend (Next.js)**: Tailwind + ShadCN UI, providing drag-and-drop uploads, real-time results, heatmaps, and forensic metadata.
2. **Backend (FastAPI)**: REST endpoints (`/detect`, `/system/status`), SlowAPI rate limiting, async inference hooks, pre-JWT middleware stubs.
3. **AI Engine (PyTorch)**: EfficientNet-B0 (currently active best model), trained on CIFAKE/synthetic. Supports MPS (Apple Silicon), CUDA, and CPU.
4. **Security**: SHA-256 model hashing, AES-256-CBC model weight encryption.
5. **Orchestration**: Docker Compose for Phase 1. Hooks prepared in `cloud-orchestrator/` for Kubernetes Phase 2.

## Key Agents Constraints
- **Zero-Trust**: Do not expose training data.
- **Privacy**: No external logging without user consent.
- **Immutable**: All models must be hashed.
