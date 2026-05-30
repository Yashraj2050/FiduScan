# Git Remediation — Git Remediation Execution Plan
*Generated: 2026-05-30 19:47 UTC*

## Step-by-Step Remediation Instructions
This plan outlines the exact sequence of commands required to clean the repository history, reclaim space, and restore push health.

### Step 1: Install `git-filter-repo`
We will use `git-filter-repo` because it is the officially recommended, safer, and faster alternative to `git filter-branch`.
On macOS:
```bash
brew install git-filter-repo
```
Alternatively, via pip:
```bash
pip install git-filter-repo
```

### Step 2: Back Up Local Model Weights
Because `git filter-repo` deletes filtered files from the working directory during rewriting, we must temporarily back up our checkpoints.
Run:
```bash
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
```

### Step 3: Run History Remediation
Rewrite the Git history to purge all model weights.
Run:
```bash
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
```

### Step 4: Apply Hardened `.gitignore`
Update `.gitignore` to prevent future commits. Copy the content from `/reports/gitignore_review.md` into `.gitignore`.
Run:
```bash
git add .gitignore
git commit -m "chore: harden .gitignore to exclude all model checkpoints recursively"
```

### Step 5: Restore Backed-Up Models
Restore the checkpoints back to the `models/` folder. They will now be ignored.
Run:
```bash
cp -r /tmp/fiduscan_models_backup/* models/
rm -rf /tmp/fiduscan_models_backup
```

### Step 6: Garbage Collection & Size Check
Reclaim disk space locally and check size.
Run:
```bash
git reflog expire --expire=now --all
git gc --prune=now --aggressive
du -sh .git
```

### Step 7: Push the Rewritten History
Re-add the remote origin (as `git filter-repo` removes all remotes for safety to prevent accidental force pushes) and force-push.
Run:
```bash
git remote add origin https://github.com/Yashraj2050/FiduScan.git
git push origin main --force
```
*Note: Ensure you update tag references if needed.*

