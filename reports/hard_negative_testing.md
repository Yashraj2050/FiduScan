# FiduScan Phase 2B — Hard Negative Testing
*Generated: 2026-05-30 18:09 UTC*

---

## Overview

Hard negative testing evaluates how often the detector **incorrectly flags authentic images**
that have been processed in ways common in real-world deployment scenarios.
All 300 test images (15 categories × 20) are authentic — any positive detection is a False Positive.

---

## Results Summary

| Model | Total FP | Total Images | FP Rate | Danger Zone | Mean Confidence |
|-------|----------|-------------|---------|-------------|----------------|
| `efficientnet_b0` | 0 | 300 | 0.0000 | 0 | 0.0293 |
| `resnet50` | 0 | 300 | 0.0000 | 0 | 0.0355 |


> **Danger Zone**: Images where confidence ≥ 0.45 (near decision threshold).
> A high danger-zone rate indicates the model is uncertain on authentic content.

---

## Per-Category Results

| Category | Description | Model | FP/Total | FP Rate | Mean Conf |
|----------|-------------|-------|----------|---------|-----------|
| `whatsapp_compressed` | double JPEG Q=35→Q=72 | `efficientnet_b0` | 0/20 | 0.000 | 0.022 |
| `whatsapp_compressed` | double JPEG Q=35→Q=72 | `resnet50` | 0/20 | 0.000 | 0.030 |
| `instagram_export` | sRGB color shift + 1080px crop | `efficientnet_b0` | 0/20 | 0.000 | 0.029 |
| `instagram_export` | sRGB color shift + 1080px crop | `resnet50` | 0/20 | 0.000 | 0.029 |
| `cropped_resized` | random 80-95% crop + 224px resize | `efficientnet_b0` | 0/20 | 0.000 | 0.029 |
| `cropped_resized` | random 80-95% crop + 224px resize | `resnet50` | 0/20 | 0.000 | 0.029 |
| `brightness_boosted` | brightness +60% | `efficientnet_b0` | 0/20 | 0.000 | 0.035 |
| `brightness_boosted` | brightness +60% | `resnet50` | 0/20 | 0.000 | 0.027 |
| `contrast_reduced` | contrast ×0.5 | `efficientnet_b0` | 0/20 | 0.000 | 0.023 |
| `contrast_reduced` | contrast ×0.5 | `resnet50` | 0/20 | 0.000 | 0.028 |
| `desaturated` | desaturation + partial grayscale | `efficientnet_b0` | 0/20 | 0.000 | 0.022 |
| `desaturated` | desaturation + partial grayscale | `resnet50` | 0/20 | 0.000 | 0.029 |
| `motion_blurred` | directional motion blur kernel | `efficientnet_b0` | 0/20 | 0.000 | 0.036 |
| `motion_blurred` | directional motion blur kernel | `resnet50` | 0/20 | 0.000 | 0.029 |
| `moire_screen` | screen photograph moiré simulation | `efficientnet_b0` | 0/20 | 0.000 | 0.029 |
| `moire_screen` | screen photograph moiré simulation | `resnet50` | 0/20 | 0.000 | 0.029 |
| `multi_resaved` | 4× sequential JPEG re-save at Q=80 | `efficientnet_b0` | 0/20 | 0.000 | 0.025 |
| `multi_resaved` | 4× sequential JPEG re-save at Q=80 | `resnet50` | 0/20 | 0.000 | 0.029 |
| `watermarked` | text watermark overlay | `efficientnet_b0` | 0/20 | 0.000 | 0.037 |
| `watermarked` | text watermark overlay | `resnet50` | 0/20 | 0.000 | 0.029 |
| `vintage_filter` | sepia + vignette + film grain | `efficientnet_b0` | 0/20 | 0.000 | 0.019 |
| `vintage_filter` | sepia + vignette + film grain | `resnet50` | 0/20 | 0.000 | 0.030 |
| `noise_added` | heavy Gaussian noise σ=25 | `efficientnet_b0` | 0/20 | 0.000 | 0.036 |
| `noise_added` | heavy Gaussian noise σ=25 | `resnet50` | 0/20 | 0.000 | 0.029 |
| `color_shifted` | R+20 G-15 B+10 channel shift | `efficientnet_b0` | 0/20 | 0.000 | 0.035 |
| `color_shifted` | R+20 G-15 B+10 channel shift | `resnet50` | 0/20 | 0.000 | 0.029 |
| `low_res_upscaled` | downsample to 32px → upscale to 224px (blurry) | `efficientnet_b0` | 0/20 | 0.000 | 0.025 |
| `low_res_upscaled` | downsample to 32px → upscale to 224px (blurry) | `resnet50` | 0/20 | 0.000 | 0.129 |
| `hdr_tonemapped` | local contrast enhancement (HDR-like) | `efficientnet_b0` | 0/20 | 0.000 | 0.036 |
| `hdr_tonemapped` | local contrast enhancement (HDR-like) | `resnet50` | 0/20 | 0.000 | 0.029 |


---

## Analysis

### High-Risk Categories
Categories where FP rate exceeds 5% are high-risk for deployment:
- Heavy JPEG compression may remove noise patterns the model uses for "authentic" classification
- Low-resolution upscaling introduces interpolation artifacts that may resemble GAN checkerboard
- Moiré patterns from screen photography have periodic frequency signatures similar to GAN grids

### Confidence Drift
A mean confidence significantly above 0.05 for authentic images indicates the model
is less certain about authentic content, increasing the risk of threshold-sensitive FP errors.

---

*FiduScan Anti-Gravity Forensic System — Phase 2B Task 3*
