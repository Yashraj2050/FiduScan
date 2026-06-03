# Video Watermark Design

## Overview
This document specifies the technical design for the FiduScan video watermarking engine, treating video as a spatial-temporal medium.

## Supported Techniques
1. **Spatial Frame Watermarking:**
   - **Method:** Applies image watermarking techniques (DWT-SVD) to individual I-frames within the video stream. Highly robust against frame dropping but susceptible to heavy compression.
2. **Temporal Watermarking:**
   - **Method:** Embeds the payload across the time axis (e.g., modulating the motion vectors or altering the temporal correlation between successive P and B frames). 
   - **Advantage:** Highly robust against transcoding and frame rate conversion, and invisible to frame-by-frame analysis.

## Robustness Criteria
- **Compression:** Must survive aggressive H.264 / H.265 compression common in social media re-encoding (e.g., WhatsApp, TikTok).
- **Format Conversion:** Must survive shifting between container formats (MP4, MKV, WebM).
- **Editing:** Payload redundancy must ensure extraction even if the video is trimmed by up to 50% or if the frame rate is interpolated/decimated (e.g., 60fps to 30fps).
- **Collusion Attacks:** Temporal payload structuring must resist frame averaging attacks.
