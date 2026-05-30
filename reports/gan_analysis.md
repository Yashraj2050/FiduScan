# FiduScan Phase 2B — GAN Detection Analysis
*Generated: 2026-05-30 18:09 UTC*

---

## Background

In Phase 2A, EfficientNet-B0 missed **47 out of 50 GAN-generated images** (FNR = 0.94)
in the `ai_generated_gan` test category. This task isolates 5 specific GAN artifact sub-types
to identify which failure modes account for the misses.

---

## Sub-Type Benchmark Results

| Sub-Type | Description | Model | Detected | FNR | Mean Conf | FFT Mag |
|----------|-------------|-------|----------|-----|-----------|---------|
| `checkerboard` | 8px transposed-conv upsampling artifact | `efficientnet_b0` | 50/50 | 0.000 | 0.700 | 4.1267 |
| `checkerboard` | 8px transposed-conv upsampling artifact | `resnet50` | 0/50 | 1.000 | 0.041 | 4.1267 |
| `spectral_grid` | Nyquist-frequency spectral line artifact | `efficientnet_b0` | 33/50 | 0.340 | 0.607 | 2.9866 |
| `spectral_grid` | Nyquist-frequency spectral line artifact | `resnet50` | 50/50 | 0.000 | 0.972 | 2.9866 |
| `mode_collapse` | Near-uniform region (GAN mode collapse) | `efficientnet_b0` | 0/50 | 1.000 | 0.065 | 5.1462 |
| `mode_collapse` | Near-uniform region (GAN mode collapse) | `resnet50` | 50/50 | 0.000 | 0.926 | 5.1462 |
| `edge_ringing` | Gibbs-like ringing at sharp edges | `efficientnet_b0` | 50/50 | 0.000 | 0.726 | 0.0451 |
| `edge_ringing` | Gibbs-like ringing at sharp edges | `resnet50` | 50/50 | 0.000 | 0.972 | 0.0451 |
| `color_quantization` | Limited colour palette (GAN colour mode) | `efficientnet_b0` | 0/50 | 1.000 | 0.038 | 6.2561 |
| `color_quantization` | Limited colour palette (GAN colour mode) | `resnet50` | 0/50 | 1.000 | 0.028 | 6.2561 |


---

## Worst-Case Sub-Types

| Model | Hardest GAN Sub-Type |
|-------|---------------------|
| `efficientnet_b0` | `mode_collapse` |
| `resnet50` | `checkerboard` |


---

## Frequency Domain Analysis

FFT mean log-magnitude provides a proxy for frequency richness:
- **High magnitude** → complex frequency content (harder to separate from real)
- **Low magnitude** → simple structure (should be easier to detect)

| Sub-Type | FFT Mean Log-Magnitude | Interpretation |
|----------|----------------------|----------------|
| `checkerboard` | 4.1267 | Simple spectrum |
| `spectral_grid` | 2.9866 | Simple spectrum |
| `mode_collapse` | 5.1462 | Complex spectrum |
| `edge_ringing` | 0.0451 | Simple spectrum |
| `color_quantization` | 6.2561 | Complex spectrum |


---

## Root Cause Analysis

### Why GAN Images Were Missed in Phase 2A

1. **Training distribution mismatch**: Phase 2A GAN proxy used heavy Gaussian blur + random colored circles. Real GAN artifacts (checkerboard at 8px stride, spectral Nyquist peaks) were not in training data.
2. **Global statistics classification**: Grad-CAM showed 62–75% non-localised activations, suggesting the model classified on image-level blur level, not on specific GAN artifact patterns.
3. **Mode collapse images**: Near-uniform images receive low AI confidence because training data associated "smooth = AI" only with blurred backgrounds, not uniform fields.

---

## Architectural Recommendations

1. **Frequency domain head**: Add a DCT/FFT spectral feature branch to EfficientNet-B0 to capture Nyquist-frequency GAN artifacts directly
2. **Augmentation with GAN patterns**: Include 8px checkerboard, spectral grids, and mode-collapse images in training augmentation
3. **Fourier attention**: Use attention applied to FFT magnitude spectrum to detect periodic artifacts
4. **Multi-scale analysis**: GAN checkerboard artifacts are scale-specific — processing at multiple resolutions helps detection

---

*FiduScan Anti-Gravity Forensic System — Phase 2B Task 4*
