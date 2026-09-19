<br>

<div align="left">
  <h1>FIDUSCAN</h1>
  <p style="font-family: monospace; letter-spacing: 1px; color: #8b949e;">DIGITAL MEDIA FORENSICS</p>
  <p>PyTorch-based digital media forensics pipeline for AI-generated image classification, model explainability, and artifact integrity verification.</p>
</div>

<br>
<br>

---

<br>

## Overview
As generative AI models become increasingly sophisticated, distinguishing between authentic and synthetic media is a critical challenge in digital forensics. FiduScan explores this by coupling vision models with interpretability frameworks to generate traceable evidence for classifications rather than acting as a black box.

## Current Implementation
- **Implemented:** Image classification pipeline (EfficientNet-B0), Grad-CAM explainability, and cryptographic model hashing via a CLI inference script.
- **Experimental:** Audio deepfake detection (spectrogram classification MVP mock via offline synthetic datasets).
- **Planned:** FastAPI gateway, Video deepfake detection, live dataset integration.

## Architecture

```text
INPUT
  │
  └── IMAGE (CLI)
         ↓
      EfficientNet-B0 (Binary Classification)
         ↓
      Grad-CAM (Explainability Heatmap)
         ↓
      Cryptographic Artifact Validation
```

## Models

**1. Vision Forensics Backbone**
- **Name:** EfficientNet-B0
- **Purpose:** Binary classification of AI-generated vs. authentic images.
- **Implementation Status:** Implemented.
- **Training Status:** Configured via `train.py` utilizing AdamW and CosineAnnealingLR.
- **Inference Status:** Executable via `inference/predict.py` (CLI).

**2. Audio Spectrogram Classifier (CNN)**
- **Purpose:** Detect audio deepfakes from Mel-Spectrogram conversions.
- **Implementation Status:** Simulated MVP.
- **Training Status:** Offline mock execution using synthetic proxy datasets.
- **Inference Status:** Not implemented.

## Dataset
- **Synthetic vs Real Data:** Current validation uses offline synthetic datasets; large-scale real-world benchmarking is not yet integrated.
- **Preprocessing:** Standard ImageNet normalization and `(224, 224)` resizing via `torchvision.transforms`.
- **Train/Validation/Test Split:** Splitting logic is structurally stubbed for pipeline validation.
- **Known Limitations:** Lacks live integration with large-scale deepfake corpora (e.g., DFDC).

## Training
The training pipeline (`training/train.py`) utilizes Cross-Entropy Loss, the AdamW optimizer, and CosineAnnealingLR for learning rate scheduling. It implements structural performance benchmarking (`sklearn.metrics`).

## Inference & Security
Inference is executed via a standalone CLI script (`inference/predict.py`) which processes images through the PyTorch pipeline. Prior to inference, the model weights are strictly validated via SHA-256 cryptographic hashing (`security/crypto.py`) to prevent tampering.

## Explainability
Grad-CAM (Gradient-weighted Class Activation Mapping) is implemented (`ai_engine/explainability.py`). It intercepts activations at the final convolutional layer of the EfficientNet-B0 backbone to generate visual heatmaps of the regions most influential to the model's decision.

## API
**Implementation Status:** Planned. A FastAPI service layer is not currently part of the implemented inference path.

## Deployment
Dockerization is structurally configured (`Dockerfile` and `docker-compose.yml`), preparing the environment for future containerized API deployment.

## Evaluation
- **Benchmark Results:** Structural benchmarking logic is implemented; awaits live production data scaling.
- **Limitations:** Large-scale real-world accuracy claims are omitted until comprehensive testing against real deepfake corpora is complete.

## Visual Evidence
> **TODO:** Insert generated Grad-CAM heatmap visualization here once exported from the inference pipeline.

## Roadmap
- Implementation of the FastAPI gateway.
- Integration of actual video frame-extraction models (Phase 3B).

## Project Structure
```text
FiduScan/
├── ai_engine/          # Core EfficientNet-B0 & Grad-CAM models
├── inference/          # CLI prediction script
├── training/           # Train loops and mock dataset pipelines
├── security/           # Model artifact integrity verification
└── reports/            # Detailed Phase 1-3 architecture research
```

## Setup
```bash
git clone https://github.com/yashrajdnyaneshwarkuyate/FiduScan.git
cd FiduScan
pip install -r requirements.txt
```

## Usage
Run inference and cryptographic validation on a single image:
```bash
python inference/predict.py --image test_image.jpg
```

## Technology
PyTorch, Torchvision, Docker.
