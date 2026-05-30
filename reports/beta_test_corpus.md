# Phase 4A — Multimodal Test Corpus
*Generated: 2026-05-30 19:21 UTC*

## Objective
A curated evaluation dataset designed specifically for FiduScan's Beta Launch.

## Corpus Composition
- **Images (n=5,000)**: 
  - 2,000 Smartphone authentic (iPhone, Samsung)
  - 1,000 Compressed/Web exports (JPEG 60%, WebP)
  - 1,000 Midjourney/Stable Diffusion generations
  - 1,000 Hard negatives (HDR authentic, heavily filtered Instagram photos)
- **Audio (n=2,000)**:
  - 1,000 Authentic (WhatsApp Voice Notes, Memos, high background noise)
  - 1,000 AI-Generated (ElevenLabs, PlayHT, VALL-E)
- **Video (n=1,000)**:
  - 500 Social Media Clips (TikTok/Reels compressed, fast motion)
  - 500 Deepfakes (FaceSwap, HeyGen avatars, Wav2Lip syncing)

## Characteristics
This corpus specifically over-indexes on *hard negatives* (highly compressed authentic data) to aggressively test the False Positive reduction implemented in Phase 2C.
