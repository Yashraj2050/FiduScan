# FiduScan Phase 2B — Explainability Audit
*Generated: 2026-05-30 18:10 UTC*

---

## Methodology

Each Grad-CAM heatmap is classified into one of three quality categories:

| Category | Criteria | Interpretation |
|----------|---------|----------------|
| **FORENSIC** | Centre mass ratio > 55% AND entropy > 3.0 | Model attends to content-area forensic artifacts ✅ |
| **DIFFUSE** | Moderate localisation and entropy | Model uses mixed global/local features ⚠️ |
| **SHORTCUT** | Centre mass ratio < 40% OR entropy < 1.5 | Model relies on background/border statistics 🔴 |

**Localisation Score** = fraction of top activation mass in the central 50% of the image.
**Entropy** = Shannon entropy of the normalised activation map (higher = more spread/informative).

---

## Results

| Model | Samples | FORENSIC | SHORTCUT | DIFFUSE |
|-------|---------|---------|---------|--------|
| `efficientnet_b0` | 20 | 8 (40%) | 11 (55%) | 1 (5%) |
| `resnet50` | 20 | 0 (0%) | 20 (100%) | 0 (0%) |


---

## Analysis

### Shortcut Learning
- `efficientnet_b0`: 55% shortcut rate — 🔴 HIGH — model uses background statistics
- `resnet50`: 100% shortcut rate — 🔴 HIGH — model uses background statistics


### Background Dependence Risk
When activations cluster at image borders (SHORTCUT classification), the model may be detecting
JPEG compression boundaries, image padding artefacts, or dataset-wide background color statistics
rather than genuine AI-generation forensic signatures.

### Recommendations

1. **Attention regularisation**: Add a spatial attention entropy regularisation loss term to encourage localised activations
2. **Center-crop augmentation**: Force the model to classify from content regions only using random center-crop augmentation
3. **Patch masking**: During training, randomly mask border patches (50px) to prevent border shortcut learning
4. **Frequency domain supervision**: Add a DCT auxiliary loss to explicitly supervise spectral feature learning

---

*FiduScan Anti-Gravity Forensic System — Phase 2B Task 5*
