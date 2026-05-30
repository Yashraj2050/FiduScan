# FiduScan Phase 2A — Risk Analysis
*Generated: 2026-05-30 17:51 UTC*

---

## ⚠️  CRITICAL INVESTIGATION: Perfect Scores Detected

Models reporting Accuracy = 1.0, F1 = 1.0, AUC = 1.0:
**`efficientnet_b0`, `resnet50`**

### Root Cause Analysis

| Hypothesis | Likelihood | Evidence |
|------------|-----------|---------|
| **Synthetic proxy dataset too simple** | 🔴 HIGH | Real/fake classes generated with clearly different statistics (heavy blur for fake, noise for real) — classifier trivially separates them |
| **Train/test contamination** | 🟡 MEDIUM | Same random seed used across runs; combined dataset shuffle may not be fully isolated |
| **Duplicate leakage** | 🟡 MEDIUM | Combined dataset merges 3 sources; partial-hash dedup (4096 bytes) may miss near-duplicates |
| **Overly easy classification boundary** | 🔴 HIGH | Synthetic images have artificial forensic signals not present in real AI-generated images |
| **Dataset memorisation** | 🟡 MEDIUM | Small dataset (8000 images); models may memorise rather than generalise |

### Forensic Verdict

> [!CAUTION]
> **These scores are NOT representative of real-world forensic performance.**
> The synthetic proxy datasets were designed to have statistically separable real/fake
> distributions (Gaussian noise vs. heavy Gaussian blur + GAN grid artifacts).
> A linear classifier would likely achieve near-perfect accuracy on this distribution.
> **All F1/AUC metrics from this phase must be treated as internal validation benchmarks only.**

### Required Actions Before Production

1. Replace synthetic proxies with real forensic datasets (CIFAKE Kaggle, Synthbuster Inria, FF++ TUM)
2. Re-run full training/evaluation pipeline
3. Verify no sample overlap between train and test splits using SHA-256 full-file hashing
4. Run adversarial evaluation (FGSM, PGD) to measure real robustness
5. Evaluate on held-out images from unseen generation models (Midjourney v6, SDXL, DALL·E 3)

---

## 1. Dataset Limitations

### 1.1 Provenance

| Dataset | Source | Risk Level |
|---------|--------|-----------|
| CIFAKE | Synthetic proxy | 🔴 HIGH — not real forensic data |
| Synthbuster | Synthetic proxy | 🔴 HIGH — not real forensic data |
| FaceForensics++ | Synthetic proxy | 🔴 HIGH — not real forensic data |

> [!WARNING]
> All three datasets are **synthetic proxies**. Real CIFAKE, Synthbuster, and FF++
> datasets require institutional access or Kaggle API keys. Phase 2A metrics
> **cannot** be used for external validation claims.

### 1.2 Distribution Shift Risks

- Training images are 224×224 — high-frequency forensic signals lost at full resolution
- Synthetic fake images have **artificial** diffusion/GAN artifacts, not true generator fingerprints
- Production images arrive from diverse cameras, social platforms, and editing pipelines
- Double-JPEG compression common in real deployment scenarios — removes model-detectable artifacts

### 1.3 Class Balance

- All splits are 50/50 balanced — real-world deployments may be 95/5 or 99/1 (mostly authentic)
- FPR/FNR at production-realistic imbalance not evaluated

---

## 2. Model-Specific Weaknesses

### EfficientNet-B0
- Optimised for object recognition, not forensic frequency analysis
- Mobile-oriented channel scaling may underweight forensic feature maps
- Vulnerable to adversarial perturbations (no adversarial training applied)

### ResNet50
- Skip connections may dilute forensic boundary signals across layers
- Higher parameter count without proportional forensic benefit
- Older architecture; transformer attention better suited for global artifact detection

### ViT-B16 (PRELIMINARY)
- Training stopped at partial epoch 1 — **weights are not converged**
- Requires large datasets for effective fine-tuning (pre-training mismatch)
- Higher latency unsuitable for real-time API deployment
- Global attention may not localise forensic artifacts in small regions

---

## 3. Adversarial Vulnerabilities

| Attack | Risk | Description |
|--------|------|-------------|
| FGSM | 🔴 HIGH | Imperceptible gradient-sign perturbations flip predictions |
| PGD  | 🔴 HIGH | Iterative attack — stronger than FGSM |
| JPEG re-compression | 🟡 MEDIUM | Removes detectable generation artifacts |
| Resize + upscale | 🟡 MEDIUM | Destroys frequency-domain fingerprints |
| Noise injection | 🟡 MEDIUM | Masks GAN/diffusion artifacts |
| Anti-forensic watermarks | 🔴 HIGH | Crafted pixel patterns evade detection |
| Style transfer | 🟡 MEDIUM | Authentic style applied to AI image |

---

## 4. Deployment Risks

| Risk | Severity | Mitigation |
|------|---------|------------|
| False accusations of authentic content | 🔴 CRITICAL | Human review for confidence 0.40–0.65 |
| Model staleness vs. new generators | 🔴 HIGH | Quarterly retraining with new AI samples |
| Adversarial bypass | 🔴 HIGH | Ensemble + input validation + rate limiting |
| GDPR / image privacy | 🟡 MEDIUM | Strip EXIF before processing; no image retention |
| Synthetic dataset performance inflation | 🔴 HIGH | Do not publish Phase 2A metrics externally |
| Threshold miscalibration | 🟡 MEDIUM | Apply temperature scaling to output logits |

---

## 5. Recommended Mitigations

1. **Real dataset acquisition**: CIFAKE (Kaggle), Synthbuster (Inria GITLAB), FF++ (TUM)
2. **Confidence thresholding**: Flag >0.75 as AI; human review 0.40–0.75; pass <0.40 as authentic
3. **Ensemble deployment**: Top-2 models must agree for positive classification
4. **Adversarial hardening**: FGSM/PGD training data augmentation
5. **Full-file deduplication**: SHA-256 complete file hashing before any split
6. **Frequency-domain features**: Augment CNN with DCT/FFT analysis head
7. **Calibration**: Temperature scaling post-training

---

*FiduScan Anti-Gravity Forensic System — Phase 2A Risk Analysis*
