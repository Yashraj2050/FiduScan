# Git Remediation — Removal Verification
*Generated: 2026-05-31 01:20 IST*

## Proposed Removal Targets

The following files are targeted for removal from the Git history. They have been reviewed and categorized.

### 🟢 SAFE TO REMOVE (Targeted)
These files are binary model checkpoints and weights. They belong in Cloud Storage or a dedicated model registry, not in Git history. Removing them will not impact source code execution, provided they are backed up and restored locally.

| File Path | Size | Category |
|-----------|------|----------|
| `models/audio/Model_A_CNN.pth` | < 1 MB | checkpoints |
| `models/audio/Model_B_EfficientNet.pth` | 15.59 MB | checkpoints |
| `models/audio/Model_C_Waveform.pth` | < 1 MB | checkpoints |
| `models/checkpoints/vit_b16_checkpoint.pth` | 327.36 MB | checkpoints |
| `models/encrypted/efficientnet_b0_fiduscan.enc` | 18.08 MB | checkpoints |
| `models/phase2b/exp_a.pth` | 18.06 MB | checkpoints |
| `models/phase2b/exp_b.pth` | 18.06 MB | checkpoints |
| `models/phase2b/exp_c.pth` | 18.06 MB | checkpoints |
| `models/phase2b/exp_d.pth` | 91.96 MB | checkpoints |
| `models/phase2c/efficientnet_phase2c.pth` | 18.08 MB | checkpoints |

### 🟡 REQUIRES REVIEW (Preserved)
The following files reside in the `models/` directory or relate to model management but are source code, scripts, or configurations. They will be **PRESERVED** and are not targeted for removal.

| File Path | Purpose |
|-----------|---------|
| `models/registry.py` | Source code for model loading |
| `models/encrypted/.aes_key.bin` | Encryption key (Required for local decryption) |
| `logs/model_hashes.json` | Hash validation log |
| `security/model_hashes.json` | Core hash validation configuration |

## Verification Conclusion
The proposed list of removals exclusively targets large binary blobs (model weights/checkpoints). No source code, configuration files, migrations, or deployment scripts are included in the removal list.

**Status: VERIFIED SAFE**
