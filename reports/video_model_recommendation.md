# FiduScan Phase 3B — Video Model Recommendation
*Generated: 2026-05-30 19:15 UTC*

## Selected Architecture: Multimodal Aggregation MVP
Instead of a monolithic 3D-CNN, we formally recommend the **Multimodal Aggregation Engine**.
This architecture processes sparse keyframes and audio tracks independently using our frozen Phase 2C and Phase 3A models, then uses a weighted statistical heuristic to combine them.

**Benefits:**
- 10x faster than I3D models.
- Reuses existing heavily-hardened models.
- Explains *why* a video is fake (e.g. "Audio is fake, but frames are real").
