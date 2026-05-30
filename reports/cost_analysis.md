# Phase 5A — Cost Model
*Generated: 2026-05-30 19:39 UTC*

## Estimated Monthly Burn (GCP)
Assuming CPU-only Cloud Run (8vCPU, 4GB RAM) scaling:

- **100 Users**: ~$15/mo (mostly fixed DB costs).
- **1,000 Users**: ~$45/mo (compute begins to scale).
- **10,000 Users**: ~$120/mo (High compute, but efficiently scaled to zero during off-peak).

*Verdict*: Highly sustainable for a startup Beta launch.

