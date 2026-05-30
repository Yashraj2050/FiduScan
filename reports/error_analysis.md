# FiduScan Phase 2C — Error Analysis
*Generated: 2026-05-30 18:53 UTC*

## Hard Negative False Positive Breakdown

| Category | False Positives | FPR | Mean Confidence |
|----------|-----------------|-----|-----------------|
| `whatsapp_compressed` | 20/20 | 1.000 | 0.803 |
| `brightness_boosted` | 20/20 | 1.000 | 0.888 |
| `desaturated` | 20/20 | 1.000 | 0.838 |
| `multi_resaved` | 15/20 | 0.750 | 0.577 |
| `contrast_reduced` | 13/20 | 0.650 | 0.615 |
| `instagram_export` | 5/20 | 0.250 | 0.404 |
| `cropped_resized` | 3/20 | 0.150 | 0.359 |
| `hdr_tonemapped` | 1/20 | 0.050 | 0.158 |
| `vintage_filter` | 0/20 | 0.000 | 0.179 |
| `low_res_upscaled` | 0/20 | 0.000 | 0.062 |
| `motion_blurred` | 0/20 | 0.000 | 0.205 |
| `moire_screen` | 0/20 | 0.000 | 0.217 |
| `noise_added` | 0/20 | 0.000 | 0.101 |
| `watermarked` | 0/20 | 0.000 | 0.185 |
| `color_shifted` | 0/20 | 0.000 | 0.267 |


## Conclusion
The model is overly sensitive to artifacts mimicking AI generation, especially heavy JPEG compression and resizing artifacts.
