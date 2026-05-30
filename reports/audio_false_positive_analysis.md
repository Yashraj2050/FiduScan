# FiduScan Phase 3A — Audio False Positive Analysis
*Generated: 2026-05-30 19:05 UTC*

## Hard Negative Proxy Testing
We evaluated the selected models against simulated heavily degraded authentic audio:
1. **GSM compression (Phone)**
2. **MP3 @ 32kbps (Voice Messages)**
3. **White Noise Overlay**

**Findings:**
Like the image domain, the Audio CNN and EfficientNet models show some threshold sensitivity to heavy compression, occasionally mistaking codec artifacts for vocoder artifacts.
