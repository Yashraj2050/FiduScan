# Phase 4A — Failure Analysis
*Generated: 2026-05-30 19:21 UTC*

## Key Failure Modes

1. **False Positives (Authentic flagged as AI)**
   - Heavily compressed WhatsApp audio notes occasionally trigger the vocoder artifact detector (the compression smears high frequencies similarly to synthetic audio).
   - "Deep Fried" internet memes (extreme JPEG artifacts + saturation) trigger the Image CNN.

2. **False Negatives (AI flagged as Authentic)**
   - High-fidelity HeyGen avatars where the video is exported at 4K resolution can bypass the temporal flicker heuristic.
   - Stable Diffusion v3 images with injected "film grain" noise successfully trick the high-frequency artifact detector.

3. **Confidence Calibration Issues**
   - The model is overconfident on Video. When Video metadata is stripped (e.g., downloaded via Twitter), the metadata score defaults to "suspicious", artificially inflating the AI score on authentic ripped videos.
