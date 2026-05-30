# FiduScan Phase 3A — Audio Explainability
*Generated: 2026-05-30 19:05 UTC*

## Spectrogram Grad-CAM Analysis
Applying Grad-CAM to the EfficientNet Spectrogram model reveals:
- **Authentic Speech:** Activations heavily cluster around natural harmonic overtones and breath/fricative noise blocks.
- **AI-Generated Speech:** Activations focus tightly on the high-frequency boundaries (typically 8kHz+) where vocoders (like HiFi-GAN) struggle to synthesize phase accurately, resulting in visual "smearing" on the spectrogram.

**Conclusion:** The model learns genuine acoustic generation artifacts rather than shortcuts like background room noise.
