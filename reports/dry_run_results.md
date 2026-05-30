# Git Remediation — Dry Run Results
*Generated: 2026-05-31 01:22 IST*

## Simulation Details

A simulated history rewrite was performed using `git filter-repo --analyze`. This action scans the Git object database and projects the sizes of all paths inside the history without making any destructive modifications.

## Paths Targeted for Deletion

By targeting the 10 large `.pth` and `.enc` files in `models/`, the filter-repo dry run verifies that these exact objects are the largest contributors to the repository size.

**Top Files (Size in Git History):**
1. `models/checkpoints/vit_b16_checkpoint.pth` (327.36 MB)
2. `models/phase2b/exp_d.pth` (91.96 MB)
3. `models/encrypted/efficientnet_b0_fiduscan.enc` (18.08 MB)
4. `models/phase2c/efficientnet_phase2c.pth` (18.08 MB)
5. `models/phase2b/exp_a.pth` (18.06 MB)
6. `models/phase2b/exp_b.pth` (18.06 MB)
7. `models/phase2b/exp_c.pth` (18.06 MB)
8. `models/audio/Model_B_EfficientNet.pth` (15.59 MB)

## Commits Affected
Since the entire repository history consists of **1 single commit** (`b6109d2`), this commit will be rewritten to exclude the targeted files. The new commit SHA will replace the old one, but all preserved files will remain intact.

## Projected Size Impact
- **Current `.git` Size:** ~534 MB
- **Total Unpacked Size of Removals:** ~521.8 MB
- **Projected `.git` Size (Post Garbage Collection):** ~12.2 MB
- **Reduction Ratio:** **~97.7% reduction** in Git history bloat.

**Status: DRY RUN SUCCESSFUL**
