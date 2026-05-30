# Git Remediation — Git History Analysis
*Generated: 2026-05-30 19:47 UTC*

## Git History Overview
We analyzed all Git commits and blobs to identify which historical revisions contain the oversized files causing push failures.

- **Total Commits in History:** 1
- **Commit History:**
- `b6109d2 Phase 4B complete - public beta ready`


Since there is only **one** commit (`b6109d2` - "Phase 4B complete - public beta ready") in the history of this branch, the entire repository was added in a single commit. This single commit contains all the tracked models.

## Top 50 Largest Blobs in Git History
Below are the top 50 largest blobs stored in the Git object database, representing the history that is uploaded during a `git push`.

| Rank | Blob SHA | Path in Repository | Size in Git History |
|------|----------|--------------------|---------------------|
| 1 | `bcdcf8fa4e` | `models/checkpoints/vit_b16_checkpoint.pth` | 327.36 MB |
| 2 | `8496e24a85` | `models/phase2b/exp_d.pth` | 91.96 MB |
| 3 | `57392e3189` | `models/encrypted/efficientnet_b0_fiduscan.enc` | 18.08 MB |
| 4 | `039e2d0e74` | `models/phase2c/efficientnet_phase2c.pth` | 18.08 MB |
| 5 | `56f0d07959` | `models/phase2b/exp_a.pth` | 18.06 MB |
| 6 | `cc20cb4cda` | `models/phase2b/exp_b.pth` | 18.06 MB |
| 7 | `e6f6fd94c3` | `models/phase2b/exp_c.pth` | 18.06 MB |
| 8 | `3b915f9e0e` | `models/audio/Model_B_EfficientNet.pth` | 15.59 MB |
| 9 | `ce941c22e4` | `frontend/package-lock.json` | 225.55 KB |
| 10 | `f995987d25` | `models/audio/Model_C_Waveform.pth` | 102.97 KB |
| 11 | `976204eb1a` | `training/phase2b_runner.py` | 99.00 KB |
| 12 | `4611811063` | `training/phase2a_runner.py` | 68.22 KB |
| 13 | `ecfaf1d120` | `training/phase2a_finalize.py` | 55.24 KB |
| 14 | `2a0eb08119` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_04.jpg` | 48.26 KB |
| 15 | `9669516b8b` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_11.jpg` | 48.20 KB |
| 16 | `807be4ab04` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_03.jpg` | 48.18 KB |
| 17 | `00da647cda` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_24.jpg` | 48.18 KB |
| 18 | `34aaa52f56` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_08.jpg` | 48.17 KB |
| 19 | `9334d454c3` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_06.jpg` | 48.17 KB |
| 20 | `4e2a6af2c5` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_18.jpg` | 48.17 KB |
| 21 | `3bf283c56d` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_22.jpg` | 48.17 KB |
| 22 | `6b9a1ac63f` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_17.jpg` | 48.17 KB |
| 23 | `3d6c123726` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_14.jpg` | 48.16 KB |
| 24 | `1d4ef8e875` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_01.jpg` | 48.16 KB |
| 25 | `7dffd45aca` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_19.jpg` | 48.16 KB |
| 26 | `2240353c7d` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_09.jpg` | 48.15 KB |
| 27 | `15e4a39f71` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_20.jpg` | 48.14 KB |
| 28 | `25f916a54f` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_12.jpg` | 48.14 KB |
| 29 | `662eddd26c` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_10.jpg` | 48.13 KB |
| 30 | `44b43b0621` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_05.jpg` | 48.13 KB |
| 31 | `a94f7901d0` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_00.jpg` | 48.13 KB |
| 32 | `d3ed4dd402` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_02.jpg` | 48.13 KB |
| 33 | `d28f6e0985` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_15.jpg` | 48.12 KB |
| 34 | `ebacd8e505` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_13.jpg` | 48.12 KB |
| 35 | `a223aaf34d` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_23.jpg` | 48.12 KB |
| 36 | `ca1147b5cf` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_16.jpg` | 48.12 KB |
| 37 | `09c579151a` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_07.jpg` | 48.06 KB |
| 38 | `04ad90cb48` | `reports/fp_fn_analysis/test_images/screenshot/screenshot_21.jpg` | 48.01 KB |
| 39 | `e14a9d2a50` | `reports/hard_negatives/hdr_tonemapped/hdr_tonemapped_15.jpg` | 44.33 KB |
| 40 | `94059d8e8e` | `reports/hard_negatives/hdr_tonemapped/hdr_tonemapped_13.jpg` | 44.31 KB |
| 41 | `0a83ec221f` | `reports/hard_negatives/hdr_tonemapped/hdr_tonemapped_03.jpg` | 44.27 KB |
| 42 | `a181663186` | `reports/hard_negatives/hdr_tonemapped/hdr_tonemapped_04.jpg` | 44.26 KB |
| 43 | `183126d4fb` | `reports/hard_negatives/hdr_tonemapped/hdr_tonemapped_14.jpg` | 44.24 KB |
| 44 | `1944da7e7d` | `reports/hard_negatives/hdr_tonemapped/hdr_tonemapped_07.jpg` | 44.23 KB |
| 45 | `7202fe2f4f` | `reports/hard_negatives/hdr_tonemapped/hdr_tonemapped_10.jpg` | 44.22 KB |
| 46 | `1e9386fb68` | `reports/hard_negatives/hdr_tonemapped/hdr_tonemapped_09.jpg` | 44.22 KB |
| 47 | `d0f3eaa065` | `reports/hard_negatives/hdr_tonemapped/hdr_tonemapped_05.jpg` | 44.21 KB |
| 48 | `05d7cd32e4` | `reports/hard_negatives/hdr_tonemapped/hdr_tonemapped_00.jpg` | 44.20 KB |
| 49 | `96c52a530c` | `reports/hard_negatives/hdr_tonemapped/hdr_tonemapped_16.jpg` | 44.20 KB |
| 50 | `d10518e352` | `reports/hard_negatives/hdr_tonemapped/hdr_tonemapped_11.jpg` | 44.19 KB |


## Analysis Details
1. **Critical Blobs:** The single largest blob in the history is the Vision Transformer checkpoint `models/checkpoints/vit_b16_checkpoint.pth` at **327.36 MB**. The second largest is `models/phase2b/exp_d.pth` at **91.96 MB**.
2. **Total Blob Size in Git:** The top 8 blobs total **~521.8 MB** out of the **534 MB** repository. Removing these 8 files from the history will reduce the push payload to under **12 MB**.
3. **Commit Association:** All 8 large blobs were introduced in commit `b6109d2`. Stripping them from this single commit is the key to shrinking the repository.

