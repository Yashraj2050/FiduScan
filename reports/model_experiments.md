# FiduScan Phase 2B — Model Improvement Experiments
*Generated: 2026-05-30 18:46 UTC*

---

## Experiment Design

| Exp | Model | Training Config |
|-----|-------|----------------|
| **A** | EfficientNet-B0 | Phase 2A weights + standard augmentation (baseline) |
| **B** | EfficientNet-B0 | Phase 2A weights + strong augmentation (RandRotate30, ColorJitter0.5, GaussianBlur, RandomErasing) |
| **C** | EfficientNet-B0 | Phase 2A weights + standard aug + 3-epoch GAN-hard fine-tuning (lr=5e-5) |
| **D** | ResNet50 | Phase 2A weights + standard augmentation |

**Dataset**: Phase 2B hard synthetic (real: multi-scale Perlin + camera response; fake: GAN checkerboard + diffusion + deepfake)
**Epochs**: 5 per experiment (+ 3 fine-tuning epochs for Exp C)
**Early stopping patience**: 3 epochs on val F1

---

## Results

| Exp | Model | Epochs | Accuracy | F1 | Precision | Recall | ROC-AUC | FPR | FNR |
|-----|-------|--------|----------|----|-----------|--------|---------|-----|-----|
| **A** | efficientnet_b0 | 4 | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 0.0000 | 0.0000 |
| **B** | efficientnet_b0 | 4 | 0.9979 | 0.9986 | 0.9973 | 1.0000 | 1.0000 | 0.0089 | 0.0000 |
| **C** | efficientnet_b0 | 4 | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 0.0000 | 0.0000 |
| **D** | resnet50 | 4 | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 0.0000 | 0.0000 |


---

## Best Experiment: **A**

EfficientNet-B0 baseline (Phase 2A weights + standard augmentation)

**Test F1**: 1.0000
**Model saved**: `/Users/yashrajdnyaneshwarkuyate/FiduScan/models/phase2b/exp_a.pth`

---

## Analysis

### Augmentation Impact (A vs B)
- Experiment B (strong aug) F1: 0.998639 vs Experiment A (baseline) F1: 1.0
- Strong augmentation did not improve F1 — Phase 2B data may still be too simple to benefit

### GAN Fine-Tuning Impact (A vs C)
- Experiment C (GAN fine-tuned) FNR: 0.0 vs Experiment A FNR: 0.0
- GAN fine-tuning did not reduce FNR significantly — architecture-level changes needed

### Architecture Comparison (A vs D)
- ResNet50 (D) F1: 1.0 vs EfficientNet-B0 (A) F1: 1.0

---

## Recommendations

1. Deploy best experiment: **Exp A** (`models/phase2b/exp_a.pth`)
2. For real-data retraining, use strong augmentation (Exp B config) as default
3. Always apply GAN-hard fine-tuning after base training for production models
4. Consider frequency-domain auxiliary loss for next iteration

---

*FiduScan Anti-Gravity Forensic System — Phase 2B Task 6*
