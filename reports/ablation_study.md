# FiduScan Phase 2C — Ablation Study
*Generated: 2026-05-30 18:58 UTC*

## Model Evolution (Threshold=0.50)

| Model | F1 Score | ROC-AUC | FPR (False Alarms) | FNR (Missed GANs) |
|-------|----------|---------|--------------------|-------------------|
| `Phase_2A_Baseline` | 0.695 | 0.963 | 0.000 | 0.468 |
| `Phase_2B_GAN_FT` | 0.724 | 0.816 | 0.323 | 0.212 |
| `Phase_2C_Combined_FT` | 0.861 | 0.998 | 0.000 | 0.244 |


## Interpretation
- **Phase 2A** had 0 FPR but missed 44% of GANs.
- **Phase 2B (GAN FT)** fixed FNR (down to 8%) but spiked FPR (47%).
- **Phase 2C (Combined)** aims to balance both, lowering FPR while keeping FNR low.
