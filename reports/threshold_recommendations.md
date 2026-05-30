# FiduScan Phase 2C — Threshold Recommendations
*Generated: 2026-05-30 18:53 UTC*

## Operating Points

### A: Maximum GAN Detection (Recall)
- **Recommended Threshold:** 0.50
- **FPR:** 0.323 | **FNR:** 0.212
- *Use case:* Highly secure environments where missing a deepfake is catastrophic.

### B: Balanced Operation (F1)
- **Recommended Threshold:** 0.80
- **FPR:** 0.173 | **FNR:** 0.288
- *Use case:* General API usage.

### C: Minimum False Positives (FPR < 15%)
- **Recommended Threshold:** 0.85
- **FPR:** 0.123 | **FNR:** 0.336
- *Use case:* Consumer apps where flagging real images causes severe user frustration.
