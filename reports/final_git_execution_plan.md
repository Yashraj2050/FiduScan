# Git Remediation — Final Execution Plan
*Generated: 2026-05-31 01:23 IST*

## Execution Commands

This is the final, verified sequence of commands to safely rewrite history and push the repository.

### 1. Backup Commands (Already Completed)
We have already verified the integrity of the backup bundle. If needed in an emergency, it can be cloned:
```bash
git clone fiduscan-backup.bundle fiduscan-restored
```

### 2. Cleanup Commands
Back up the local files, execute the history rewrite to remove the large checkpoints, apply the hardened `.gitignore`, and restore the local files.

```bash
# 2a. Back up local files
mkdir -p /tmp/fiduscan_models_backup/audio
mkdir -p /tmp/fiduscan_models_backup/checkpoints
mkdir -p /tmp/fiduscan_models_backup/encrypted
mkdir -p /tmp/fiduscan_models_backup/phase2b
mkdir -p /tmp/fiduscan_models_backup/phase2c

cp models/audio/*.pth /tmp/fiduscan_models_backup/audio/
cp models/checkpoints/*.pth /tmp/fiduscan_models_backup/checkpoints/
cp models/encrypted/.aes_key.bin /tmp/fiduscan_models_backup/encrypted/
cp models/encrypted/*.enc /tmp/fiduscan_models_backup/encrypted/
cp models/phase2b/*.pth /tmp/fiduscan_models_backup/phase2b/
cp models/phase2c/*.pth /tmp/fiduscan_models_backup/phase2c/

# 2b. Run git filter-repo to rewrite history
git filter-repo --invert-paths \
  --path models/audio/Model_A_CNN.pth \
  --path models/audio/Model_B_EfficientNet.pth \
  --path models/audio/Model_C_Waveform.pth \
  --path models/checkpoints/vit_b16_checkpoint.pth \
  --path models/encrypted/efficientnet_b0_fiduscan.enc \
  --path models/phase2b/exp_a.pth \
  --path models/phase2b/exp_b.pth \
  --path models/phase2b/exp_c.pth \
  --path models/phase2b/exp_d.pth \
  --path models/phase2c/efficientnet_phase2c.pth

# 2c. Restore local models
cp -r /tmp/fiduscan_models_backup/* models/
rm -rf /tmp/fiduscan_models_backup

# 2d. Apply hardened .gitignore
# Ensure `.gitignore` ignores `models/**` but keeps `!models/registry.py`
git add .gitignore
git commit -m "chore: harden .gitignore to exclude all model checkpoints recursively"
```

### 3. Verification Commands
Garbage collect old blobs and verify repository size and health.
```bash
git reflog expire --expire=now --all
git gc --prune=now --aggressive
du -sh .git
git fsck --full --strict
git status
```

### 4. Push Commands
Re-add the remote origin and force-push the rewritten history.
```bash
git remote add origin https://github.com/Yashraj2050/FiduScan.git
git push origin main --force
```

### 5. Recovery Commands (In case of failure)
If anything goes wrong or data is lost, you can completely reset using the bundle:
```bash
cd ..
rm -rf FiduScan
git clone FiduScan/fiduscan-backup.bundle FiduScan
```
