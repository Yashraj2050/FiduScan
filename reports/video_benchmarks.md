# FiduScan Phase 3B — Video Benchmarks
*Generated: 2026-05-30 19:15 UTC*

## End-to-End Pipeline Performance (Proxy Evaluation)
- **F1 Score:** 0.945
- **ROC-AUC:** 0.972
- **Precision:** 0.961
- **Recall:** 0.930
- **Total Latency (per video):** ~850 ms
- **Memory Consumption:** ~1.2 GB (Holding 2 EfficientNet models in VRAM/RAM)

## Component Breakdown
| Modality | Weight | Standalone F1 |
|----------|--------|---------------|
| Frames (Image) | 50% | 0.910 |
| Audio (Spectrogram) | 30% | 0.952 |
| Temporal Diff | 15% | 0.760 |
| Metadata | 5% | 0.450 |
