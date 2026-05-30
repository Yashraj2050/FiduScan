# FiduScan Phase 3B — Video Forensic Research
*Generated: 2026-05-30 19:15 UTC*

## Datasets
- **FaceForensics++**: Contains pristine and manipulated videos (Deepfakes, Face2Face, FaceSwap, NeuralTextures). Standard benchmark.
- **Celeb-DF**: High visual quality deepfakes, difficult for older models.
- **DFDC**: Huge dataset with diverse perturbations.

## MVP Architecture Recommendation
**Multimodal Aggregation Pipeline**:
Instead of training a massively expensive 3D-CNN (I3D / C3D) from scratch, we will reuse our hardened Phase 2C Image model and Phase 3A Audio model.
1. Extract keyframes -> Process through EfficientNet-B0 (Image).
2. Extract audio -> Process through EfficientNet-B0 (Spectrogram).
3. Extract temporal diffs -> Temporal heuristic.
4. Metadata analysis -> Codec forensics.
5. **Weighted Voting Aggregation** for a final video authenticity score.

This is highly optimized for Apple Silicon and minimizes cloud GPU costs.
