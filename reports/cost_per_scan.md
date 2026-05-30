# Phase 5C — Cost Attribution & Scan Economics
*Generated: 2026-05-31 01:39 IST*

## Cost Model Breakdown
To establish profitable pricing tiers, we have calculated the estimated operational cost per scan across different modalities. These calculations include compute, storage, bandwidth, and database overhead.

### 1. Image Scan Cost
* **Compute (Cloud Run):** ~$0.0001 (EfficientNet-B0 executes in <200ms)
* **Storage/Bandwidth:** ~$0.0002 (Average image size 3MB)
* **Database/Logging:** ~$0.0001
* **Total Estimated Cost:** **$0.0004 per image scan**

### 2. Audio Scan Cost
* **Compute (Cloud Run):** ~$0.0008 (Whisper + Wav2Vec2 executes in ~1.5s)
* **Storage/Bandwidth:** ~$0.0005 (Average audio size 5MB)
* **Database/Logging:** ~$0.0001
* **Total Estimated Cost:** **$0.0014 per audio scan**

### 3. Video Scan Cost
* **Compute (Cloud Run):** ~$0.0080 (Frame extraction + inference takes ~15-20s)
* **Storage/Bandwidth:** ~$0.0050 (Average video size 50MB)
* **Database/Logging:** ~$0.0001
* **Total Estimated Cost:** **$0.0131 per video scan**

*Note: Video scanning is highly resource-intensive and accounts for the largest margin risk.*

**Status: COST ATTRIBUTION COMPLETED**
