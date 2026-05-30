# FiduScan — AI Forensic Detection System

> **Anti-Gravity Phase 1 MVP** | Binary Classification: AI-Generated vs. Authentic Images

FiduScan is a modular, secure, and scalable AI forensic infrastructure designed to detect AI-generated and manipulated media content with confidence scores, EXIF metadata analysis, and explainability heatmaps.

---

## Project Architecture

```
FiduScan/
├── frontend/           # Next.js web dashboard (TypeScript + TailwindCSS)
├── backend/            # FastAPI inference & routing server
├── ai-engine/          # EfficientNet-B0 model definitions + Grad-CAM
├── datasets/           # Dataset preprocessing, validation, augmentation
├── models/             # Serialized model artifacts (.pth, encrypted)
├── training/           # Training loops + config
├── inference/          # Production inference pipeline
├── security/           # SHA-256 hashing + AES encryption utilities
├── cloud-orchestrator/ # Docker & Kubernetes configs
└── logs/               # Immutable JSON inference logs
```

---

## Quick Start (Local — Apple Silicon M1)

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be available at `http://localhost:3000`.
The API will be available at `http://localhost:8000`.

---

## Training

```bash
cd training
python train.py --config config.yaml
```

Device priority: Apple Silicon MPS → CUDA GPU → CPU fallback.

---

## Dataset Setup

Place datasets under `datasets/raw/`:
- `datasets/raw/cifake/`
- `datasets/raw/synthbuster/`
- `datasets/raw/faceforensics/`

Then run the preprocessor:
```bash
python datasets/loader.py
```

---

## Security

All trained model artifacts are SHA-256 hashed on save.  
Inference events are logged immutably to `logs/inference.log`.

---

## Docker (Production)

```bash
cd cloud-orchestrator
docker-compose up --build
```

---

## Model Priority

| Priority | Attribute       |
|----------|----------------|
| 1        | Accuracy        |
| 2        | Robustness      |
| 3        | Explainability  |
| 4        | Scalability     |
| 5        | Latency         |

---

## License

Proprietary — FiduScan Anti-Gravity Forensic System © 2025
