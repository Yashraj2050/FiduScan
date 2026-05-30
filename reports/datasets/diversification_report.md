# FiduScan Phase 2B — Dataset Diversification Report
*Generated: 2026-05-30 18:09 UTC*

---

## Summary

| Sub-Dataset | Count | Source | Description |
|-------------|-------|--------|-------------|
| Hard Real | 800 | synthetic_hard_proxy | Multi-scale Perlin noise + camera response + vignetting |
| Hard GAN Fake | 800 | synthetic_hard_proxy | Checkerboard artifact + spectral grid + mode collapse |
| Hard Diffusion Fake | 800 | synthetic_hard_proxy | Over-smooth gradient + saturation spikes |
| Hard Deepfake Fake | 800 | synthetic_hard_proxy | Boundary mismatch + over-smooth face regions |
| **Total Real** | **800** | — | — |
| **Total Fake** | **2400** | — | — |

---

## Improvement Over Phase 2A

| Aspect | Phase 2A | Phase 2B |
|--------|---------|---------|
| Fake image characteristics | Simple blur + random GAN grid | Forensically-targeted: checkerboard at 8px stride, spectral peaks, mode collapse regions |
| Real image characteristics | Gaussian noise + slight blur | Multi-scale Perlin noise + camera curves + vignetting + ISO noise |
| Separation difficulty | Trivially separable (F1=1.0) | Harder — subtler statistical differences |
| GAN artifact realism | Generic grid artifact | 8px checkerboard (true upsampling artifact) + Nyquist spectral lines |
| Deepfake content | Face oval only | Face oval + boundary ring + eye asymmetry |

---

## Real Dataset Status

- **Kaggle CIFAKE**: ❌ Not available (no ~/.kaggle/kaggle.json)
- **HuggingFace CIFAKE**: Not attempted (requires `datasets` library install)
- **Synthetic proxy**: ✅ Used as fallback

> [!WARNING]
> Phase 2B still relies on synthetic proxy data. Forensic validity requires
> acquisition of real CIFAKE, Synthbuster, and FaceForensics++ datasets.
> The hard synthetic proxies improve separation difficulty but do not replicate
> true AI generator fingerprints.

---

*FiduScan Anti-Gravity Forensic System — Phase 2B Task 1*
