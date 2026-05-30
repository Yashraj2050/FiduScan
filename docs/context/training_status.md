# Training Status — FiduScan

**Last Pipeline Run**: 2026-05-28
**Device**: Apple Silicon MPS

## Active Model
- **Architecture**: EfficientNet-B0
- **Source**: `efficientnet_b0_fiduscan.pth`
- **Dataset**: Synthetic Mini-Dataset (500 real / 500 fake)
- **Status**: ✅ VALIDATED (Early stopping at Epoch 4)

## Performance Metrics (Synthetic Dataset)
- **Accuracy**: 1.000
- **F1 Score**: 1.000
- **ROC-AUC**: 1.000
- **Precision**: 1.000
- **Recall**: 1.000

## Inference Benchmarks
- **Throughput**: ~62 images / sec
- **p50 Latency**: 15.4ms
- **Memory Footprint**: 17.79 MB
- **Grad-CAM**: Supported (fallback to CPU when cv2/MPS autograd fails)

## Observations
The pipeline successfully trains, serializes, and evaluates models automatically. For production Phase 2, replace the synthetic dataset with the full Kaggle CIFAKE dataset (or similar) to achieve realistic forensic capabilities.
