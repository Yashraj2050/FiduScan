# FiduScan Phase 3B — Video Explainability
*Generated: 2026-05-30 19:15 UTC*

## Temporal Timeline
The API now returns frame-by-frame confidence arrays.
For example, if frames 1-10 are Authentic (Score: 0.1) but frames 11-15 spike to AI_GENERATED (Score: 0.9), the system flags a **Deepfake Splice**.

## Frame Highlights
Grad-CAM heatmaps are inherited from Phase 2C for the specific frames that trigger the AI flag, highlighting manipulated facial regions.
