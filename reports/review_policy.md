# FiduScan Phase 2C — Human Review Policy
*Generated: 2026-05-30 18:58 UTC*

Based on confidence calibration and threshold optimization, the following operational policy is recommended for production deployment:

## Triage Thresholds

| Decision | Confidence Range | Action |
|----------|------------------|--------|
| **AUTO PASS** | `conf < 0.60` | Automatically approve as Authentic. |
| **HUMAN REVIEW** | `0.60 ≤ conf ≤ 0.85` | Route to manual review queue. Uncertain prediction. |
| **AUTO FLAG** | `conf > 0.85` | Automatically reject/flag as AI-Generated. |

*Note: Thresholds must be recalibrated periodically as new AI generator models are released.*
