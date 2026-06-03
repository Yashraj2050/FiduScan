# Image Watermark Design

## Overview
This document specifies the technical design for the FiduScan image watermarking engine.

## Supported Techniques
1. **Discrete Cosine Transform (DCT):**
   - **Method:** Transforms image blocks into frequency components. The watermark is embedded into the mid-frequency bands, balancing perceptual invisibility with robustness against JPEG compression.
2. **Discrete Wavelet Transform (DWT):**
   - **Method:** Decomposes the image into spatial frequency sub-bands (LL, HL, LH, HH). The watermark is embedded in the LH and HL bands.
3. **Singular Value Decomposition (SVD):**
   - **Method:** Often combined with DWT (DWT-SVD). Singular values of the frequency matrices are modified to embed the payload, offering extreme robustness against geometric distortions like rotation and scaling.

## Robustness Criteria
- **Compression:** Must survive JPEG compression down to quality level 50.
- **Resizing:** Must survive downscaling up to 50% and upscaling up to 200%.
- **Cropping:** Payload redundancy must allow extraction even if 30% of the image is cropped.
- **Format Conversion:** Must survive PNG to JPEG or WebP conversions.
