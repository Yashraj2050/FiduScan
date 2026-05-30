# FiduScan Phase 3A — Audio Forensic Research
*Generated: 2026-05-30 19:04 UTC*

## Current Approaches
1. **Spectrogram Classification:** Converts audio to visual domain (Mel-Spectrogram) and uses robust vision architectures (ResNet, EfficientNet). Highly effective and leverages existing vision expertise.
2. **MFCC Features:** Classic speech processing features. Good for lightweight models but misses complex deepfake artifacts.
3. **Wav2Vec2 Embeddings:** Foundation model approach. Highly accurate but extremely computationally expensive (high latency).
4. **Whisper Feature Extraction:** Uses OpenAI Whisper encoder. Good for semantic-based spoofing, but overkill for artifact detection.
5. **Audio Fingerprinting:** Database lookup. Useless against novel deepfakes.

## Recommendation for MVP
**Spectrogram Classification via EfficientNet** provides the best balance of Latency, Accuracy, and low resource utilization. It allows us to reuse the robust tuning knowledge gained during Phase 2.
