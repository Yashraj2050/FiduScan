# Phase 4A — Beta Deployment Plan
*Generated: 2026-05-30 19:21 UTC*

## Infrastructure Topology
- **Compute**: GCP Cloud Run (or AWS App Runner) for autoscaling stateless containers.
- **Hardware**: CPU-only instances (8 vCPU, 4GB RAM). Due to EfficientNet optimization, GPUs are unnecessary for the Beta load, significantly reducing costs.
- **Frontend**: Vercel or Firebase Hosting for the Next.js React app.

## Monitoring
- Prometheus/Grafana stack exporting:
  - Inference Latency.
  - Model Confidence Distribution (to detect real-world data drift).
  - Rate Limit Trigger Count.

## Incident Response
If False Positives exceed 15% in production, the model threshold will be hot-swapped dynamically (via environment variable) from 0.50 to 0.65 to favor recall.

## Rollback
Zero-downtime Blue/Green deployments via Cloud Run traffic splitting.
