# Audio Watermark Design

## Overview
This document outlines the technical design for the FiduScan audio watermarking engine, optimized for human speech and generated music.

## Supported Techniques
1. **Spread-Spectrum (SS) Watermarking:**
   - **Method:** Distributes the watermark payload across a wide frequency band using a pseudo-random noise sequence. Offers very high robustness against ambient noise addition, cropping, and MP3 compression.
2. **Echo Hiding:**
   - **Method:** Embeds data by introducing a small, imperceptible echo to the original audio signal. Different delay times represent binary bits.
3. **Frequency Masking:**
   - **Method:** Leverages psychoacoustic models of human hearing to embed watermarks in frequencies that are naturally masked by louder, adjacent frequency bands, ensuring the watermark is strictly inaudible.

## Robustness Criteria
- **Compression:** Must survive MP3 and AAC compression down to 64 kbps.
- **Transcoding:** Must survive format shifting (e.g., WAV to MP3, FLAC to AAC).
- **Editing:** Must remain recoverable after clipping, low-pass filtering (cutoff > 8kHz), and slight pitch shifting (±2%).
