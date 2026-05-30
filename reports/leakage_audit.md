# FiduScan Phase 2B — Leakage Audit Report
*Generated: 2026-05-30 18:09 UTC*

---

## Audit Summary

| Metric | Value |
|--------|-------|
| Total images audited | 8,000 |
| Train split size | 5,600 (70.0%) |
| Validation split size | 1,200 (15.0%) |
| Test split size | 1,200 (15.0%) |
| **Exact SHA-256 leaks: Train→Val** | **0** |
| **Exact SHA-256 leaks: Train→Test** | **0** |
| **Exact SHA-256 leaks: Val→Test** | **0** |
| Cross-source filename stem overlaps | 0 |
| Partial-hash (4KB) false collision rate | 0 |
| **Overall Severity** | **LOW** |

---

## Methodology

1. **Full SHA-256** (not partial 4KB hash) computed for every image
2. Phase 2A split reproduced exactly: `random.seed(42)`, 70/15/15 ratio, `random.shuffle()`
3. Cross-split hash comparison to detect identical files appearing in multiple splits
4. Filename stem matching across CIFAKE/Synthbuster/FaceForensics sources (after removing source prefix)
5. Partial-hash (first 4096 bytes) used to detect near-identical files that escaped full-file dedup

---

## Interpretation

✅ **No exact SHA-256 duplicates** detected across train/val/test splits.

✅ **Filename contamination acceptable** — cross-source stem overlaps within expected range.

> [!NOTE]
> Despite no exact SHA-256 duplicates, the Phase 2A F1=1.0 result is still attributed
> to **dataset simplicity** rather than contamination. The synthetic proxy images have
> fundamentally different statistical distributions that make classification trivial
> regardless of split integrity.

---

## Recommendations

1. For production: Use SHA-256 full-file deduplication before splitting (replace 4KB partial hash)
2. Use stratified shuffle with per-class deduplication to guarantee balanced splits
3. Acquire real datasets — synthetic proxy stats make split contamination less relevant than dataset realism

---

*FiduScan Anti-Gravity Forensic System — Phase 2B Task 2*
