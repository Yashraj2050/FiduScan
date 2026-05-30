# FiduScan — Production Model Recommendation
*Generated: 2026-05-30 17:51 UTC — Phase 2A Forensic Validation*

---

## ✅ Selected Model: `efficientnet_b0`

### Model Scoring (all candidates)

| Model | F1 | ROC-AUC | FPR | Latency p50 | Size | **Score** | |
|-------|----|---------|-----|-------------|------|-----------|-|
| `efficientnet_b0` | 1.0000 | 1.0000 | 0.0000 | 14.4ms | 17.8MB | **7.4462** | **← SELECTED** |
| `resnet50` | 1.0000 | 1.0000 | 0.0000 | 16.0ms | 91.7MB | **7.3684** |  |
| `vit_b16` *(prelim)* | 0.2340 | 0.4597 | 0.0736 | 77.3ms | 327.3MB | **1.7451** |  |


> **Scoring weights:** F1 ×3.0 · AUC ×2.0 · (1−FPR) ×1.5 · Latency ×0.5 · Size ×0.5
> Preliminary models receive a 50% score penalty (training not converged).

---

## Selected Model Performance — `efficientnet_b0`

| Metric | Value |
|--------|-------|
| Accuracy | 1.0000 |
| F1 Score | 1.0000 |
| Precision | 1.0000 |
| Recall | 1.0000 |
| ROC-AUC | 1.0000 |
| Inference Latency p50 | 14.4ms |
| Inference Latency p99 | 15.2ms |
| Throughput | 69.3 img/s |
| Model Size | 17.8 MB |
| Parameters | 4,664,446 |

---

## Deployment Readiness

- ✅ Model artifact: `models/efficientnet_b0_phase2a.pth`
- ✅ SHA-256 hash recorded for integrity verification
- ✅ FastAPI inference endpoint: `backend/services/inference_service.py`
- ✅ Grad-CAM explainability: `reports/explainability/efficientnet_b0/`
- ⚠️  Dataset: synthetic proxies used — replace with real forensic datasets before production

---

## Selection Rationale

1. **F1 Score** (weight 3.0) — primary forensic accuracy metric
2. **ROC-AUC** (weight 2.0) — threshold-independent discrimination
3. **False Positive Rate** (weight 1.5) — false accusations harm credibility
4. **Inference Latency** (weight 0.5) — production SLA
5. **Model Size** (weight 0.5) — deployment footprint

---

*FiduScan Anti-Gravity Forensic System — Phase 2A*
