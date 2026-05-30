# Git Remediation — Repository Audit Report
*Generated: 2026-05-30 19:47 UTC*

## Overview
This audit examines the physical file structure and tracking state of the FiduScan workspace to locate the primary sources of repository bloat.

- **Workspace Path:** `/Users/yashrajdnyaneshwarkuyate/FiduScan`
- **Total Working Directory Size:** `3.5G` (includes local dependencies like `venv` and `node_modules`)
- **Total Git Folder Size (`.git`):** `508M` (indicates history bloat)
- **Total Git Objects:** `946` loose objects

## Directory Size Summary
| Directory | Size on Disk | Purpose / Tracking Status |
|-----------|--------------|---------------------------|
| `audio_pipeline` | 16K | Source directory |
| `frontend` | 555M | Frontend application (ignored node_modules) |
| `security` | 24K | Source directory |
| `cloud-orchestrator` | 28K | Source directory |
| `training` | 428K | Source directory |
| `datasets` | 374M | Datasets folder (ignored raw/processed) |
| `ai_engine` | 0B | Source directory |
| `backend` | 1.0G | Virtual environment (ignored) |
| `models` | 1.1G | Contains tracked models (~1.1GB) |
| `docs` | 24K | Source directory |
| `logs` | 112K | Source directory |
| `video_pipeline` | 8.0K | Source directory |
| `inference` | 32K | Source directory |
| `infrastructure` | 28K | Source directory |
| `ai-engine` | 20K | Source directory |
| `outputs` | 0B | Source directory |
| `validation` | 12K | Source directory |
| `reports` | 18M | Generated reports |

## Top 50 Largest Files in Working Directory
The following table shows the top 50 largest files present in the working directory, including both Git-tracked files and local/ignored dependencies.

| Rank | File Path | Size | Category | Tracked in Git? |
|------|-----------|------|----------|-----------------|
| 1 | `models/checkpoints/vit_b16_checkpoint.pth` | 327.36 MB | Model Checkpoint | Yes |
| 2 | `models/vit_b16_phase2a.pth` | 327.36 MB | Model Checkpoint | No |
| 3 | `backend/venv/lib/python3.10/site-packages/torch/lib/libtorch_cpu.dylib` | 164.66 MB | Python Virtual Env | No |
| 4 | `frontend/node_modules/@next/swc-darwin-arm64/next-swc.darwin-arm64.node` | 116.10 MB | Node Dependency | No |
| 5 | `models/resnet50_phase2a.pth` | 91.98 MB | Model Checkpoint | No |
| 6 | `models/phase2b/exp_d.pth` | 91.96 MB | Model Checkpoint | Yes |
| 7 | `models/efficientnet_b0_epoch4.pth` | 53.84 MB | Model Checkpoint | No |
| 8 | `models/efficientnet_b0_epoch2.pth` | 53.84 MB | Model Checkpoint | No |
| 9 | `backend/venv/lib/python3.10/site-packages/pyarrow/libarrow.2400.dylib` | 43.64 MB | Python Virtual Env | No |
| 10 | `backend/venv/lib/python3.10/site-packages/cv2/cv2.abi3.so` | 33.32 MB | Python Virtual Env | No |
| 11 | `backend/venv/lib/python3.10/site-packages/cryptography/hazmat/bindings/_rust.abi3.so` | 22.39 MB | Python Virtual Env | No |
| 12 | `backend/venv/lib/python3.10/site-packages/torch/lib/libtorch_python.dylib` | 20.73 MB | Python Virtual Env | No |
| 13 | `backend/venv/lib/python3.10/site-packages/pyarrow/libarrow_flight.2400.dylib` | 19.37 MB | Python Virtual Env | No |
| 14 | `models/encrypted/efficientnet_b0_fiduscan.enc` | 18.08 MB | Encrypted Model | Yes |
| 15 | `models/efficientnet_b0_fiduscan.pth` | 18.08 MB | Model Checkpoint | No |
| 16 | `models/efficientnet_b0_phase2a.pth` | 18.08 MB | Model Checkpoint | No |
| 17 | `models/phase2c/efficientnet_phase2c.pth` | 18.08 MB | Model Checkpoint | Yes |
| 18 | `models/phase2b/exp_c.pth` | 18.06 MB | Model Checkpoint | Yes |
| 19 | `models/phase2b/exp_b.pth` | 18.06 MB | Model Checkpoint | Yes |
| 20 | `models/phase2b/exp_a.pth` | 18.06 MB | Model Checkpoint | Yes |
| 21 | `models/audio/Model_B_EfficientNet.pth` | 15.59 MB | Model Checkpoint | Yes |
| 22 | `frontend/node_modules/@img/sharp-libvips-darwin-arm64/lib/libvips-cpp.8.17.3.dylib` | 15.33 MB | Node Dependency | No |
| 23 | `frontend/.next/standalone/node_modules/@img/sharp-libvips-darwin-arm64/lib/libvips-cpp.8.17.3.dylib` | 15.33 MB | Node Dependency | No |
| 24 | `backend/venv/lib/python3.10/site-packages/pyarrow/libarrow_compute.2400.dylib` | 14.96 MB | Python Virtual Env | No |
| 25 | `backend/venv/lib/python3.10/site-packages/cv2/.dylibs/libavcodec.61.19.101.dylib` | 9.82 MB | Python Virtual Env | No |
| 26 | `frontend/node_modules/typescript/lib/typescript.js` | 8.69 MB | Node Dependency | No |
| 27 | `frontend/node_modules/lightningcss/lightningcss.linux-arm64-gnu.node` | 8.46 MB | Node Dependency | No |
| 28 | `frontend/node_modules/lightningcss-linux-arm64-gnu/lightningcss.linux-arm64-gnu.node` | 8.46 MB | Node Dependency | No |
| 29 | `frontend/node_modules/lightningcss-darwin-arm64/lightningcss.darwin-arm64.node` | 8.12 MB | Node Dependency | No |
| 30 | `backend/venv/lib/python3.10/site-packages/hf_xet/hf_xet.abi3.so` | 7.34 MB | Python Virtual Env | No |
| 31 | `frontend/node_modules/@napi-rs/wasm-runtime/dist/fs.js` | 5.94 MB | Node Dependency | No |
| 32 | `frontend/node_modules/typescript/lib/_tsc.js` | 5.93 MB | Node Dependency | No |
| 33 | `frontend/node_modules/lucide-react/dist/cjs/lucide-react.js.map` | 5.38 MB | Node Dependency | No |
| 34 | `backend/venv/lib/python3.10/site-packages/cv2/.dylibs/libx265.215.dylib` | 4.73 MB | Python Virtual Env | No |
| 35 | `backend/venv/lib/python3.10/site-packages/cv2/.dylibs/libcrypto.3.dylib` | 4.63 MB | Python Virtual Env | No |
| 36 | `backend/venv/lib/python3.10/site-packages/pyarrow/libparquet.2400.dylib` | 4.55 MB | Python Virtual Env | No |
| 37 | `backend/venv/lib/python3.10/site-packages/pyarrow/libarrow_substrait.2400.dylib` | 4.55 MB | Python Virtual Env | No |
| 38 | `frontend/node_modules/next/dist/compiled/next-server/app-page-turbo-experimental.runtime.dev.js.map` | 4.34 MB | Node Dependency | No |
| 39 | `frontend/node_modules/next/dist/compiled/next-server/app-page-experimental.runtime.dev.js.map` | 4.33 MB | Node Dependency | No |
| 40 | `backend/venv/lib/python3.10/site-packages/scipy/optimize/_highspy/_core.cpython-310-darwin.so` | 4.33 MB | Python Virtual Env | No |
| 41 | `frontend/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js.map` | 4.30 MB | Node Dependency | No |
| 42 | `frontend/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js.map` | 4.29 MB | Node Dependency | No |
| 43 | `frontend/node_modules/next/dist/server/capsize-font-metrics.json` | 4.10 MB | Node Dependency | No |
| 44 | `frontend/.next/standalone/node_modules/next/dist/server/capsize-font-metrics.json` | 4.10 MB | Node Dependency | No |
| 45 | `backend/venv/lib/python3.10/site-packages/pydantic_core/_pydantic_core.cpython-310-darwin.so` | 3.96 MB | Python Virtual Env | No |
| 46 | `backend/venv/lib/python3.10/site-packages/torch/bin/protoc-3.13.0.0` | 3.86 MB | Python Virtual Env | No |
| 47 | `backend/venv/lib/python3.10/site-packages/torch/bin/protoc` | 3.86 MB | Python Virtual Env | No |
| 48 | `backend/venv/lib/python3.10/site-packages/cv2/.dylibs/libaom.3.12.1.dylib` | 3.76 MB | Python Virtual Env | No |
| 49 | `backend/venv/lib/python3.10/site-packages/uvloop/loop.cpython-310-darwin.so` | 3.62 MB | Python Virtual Env | No |
| 50 | `backend/venv/lib/python3.10/site-packages/pyarrow/lib.cpython-310-darwin.so` | 3.56 MB | Python Virtual Env | No |


## Key Audit Findings
1. **Model Checkpoints in History:** The `models/` directory contains **1.1 GB** of files, of which **~500 MB** is actively tracked in Git history (specifically `vit_b16_checkpoint.pth` and `exp_d.pth`).
2. **Untracked Local Bloat:** `backend/venv` (1.0 GB) and `frontend/node_modules` (555 MB) are present on disk but are correctly excluded by `.gitignore` and do not exist in Git history.
3. **No Tracked Datasets:** Raw datasets in `datasets/raw/` are untracked and correctly ignored.

