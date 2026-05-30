# FiduScan Phase 2B — Robustness Benchmark
*Generated: 2026-05-30 18:47 UTC*

---

## Dataset Slices

| Slice | Description | Images |
|-------|-------------|--------|
| `phase2a_test` | Phase 2A test split (in-distribution) | 120 |
| `phase2b_hard` | Phase 2B hard synthetic (harder in-distribution) | 120 |
| `gan_subtypes` | GAN sub-types (5 artifact types, all AI-generated) | 50 |
| `hard_negatives` | Hard authentic negatives (15 variation types, should be AUTHENTIC) | 200 |


---

## Results Across All Slices

| Dataset Slice | Model | N | Accuracy | F1 | Precision | Recall | ROC-AUC | FPR | FNR |
|--------------|-------|---|----------|----|-----------|--------|---------|-----|-----|
| `phase2a_test` | `phase2a_efficientnet` | 120 | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 0.0000 | 0.0000 |
| `phase2a_test` | `phase2b_best` | 120 | 0.6917 | 0.7483 | 0.5978 | 1.0000 | 0.9829 | 0.5692 | 0.0000 |
| `phase2b_hard` | `phase2a_efficientnet` | 120 | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 0.0000 | 0.0000 |
| `phase2b_hard` | `phase2b_best` | 120 | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 0.0000 | 0.0000 |
| `gan_subtypes` | `phase2a_efficientnet` | 50 | 0.5600 | 0.7179 | 1.0000 | 0.5600 | nan | 0.0000 | 0.4400 |
| `gan_subtypes` | `phase2b_best` | 50 | 0.9200 | 0.9583 | 1.0000 | 0.9200 | nan | 0.0000 | 0.0800 |
| `hard_negatives` | `phase2a_efficientnet` | 200 | 1.0000 | 0.0000 | 0.0000 | 0.0000 | nan | 0.0000 | 0.0000 |
| `hard_negatives` | `phase2b_best` | 200 | 0.5300 | 0.0000 | 0.0000 | 0.0000 | nan | 0.4700 | 0.0000 |


---

## Key Findings

### Generalisation Gap
The difference in F1 between Phase 2A test (easy in-distribution) and Phase 2B hard data
measures the model's generalisation capability:
- A gap > 0.20 indicates overfitting to training distribution characteristics
- A gap > 0.40 indicates severe distribution shift sensitivity

### GAN Detection Robustness
FNR on `gan_subtypes` slice measures specific GAN artifact recall.
Target: FNR < 0.30 for production deployment.

### False Positive Robustness
FPR on `hard_negatives` slice measures false alarm rate on challenging authentic images.
Target: FPR < 0.05 for production deployment.

---

*FiduScan Anti-Gravity Forensic System — Phase 2B Task 7*
