# Phase 5A — Object Storage
*Generated: 2026-05-30 19:39 UTC*

## Blob Storage Strategy
1. **Buckets**: Segregated `fiduscan-uploads-staging` and `fiduscan-uploads-prod`.
2. **Upload Flow**: 
   - Frontend requests a short-lived **Pre-Signed URL** from the Backend.
   - Frontend uploads the video/audio directly to GCS/S3 (bypassing Backend bandwidth).
   - GCS triggers the backend via Pub/Sub to begin inference.
3. **Lifecycle**: Multimedia files are automatically deleted after 7 days to minimize storage burn, while Metadata and Hashes remain forever in Postgres.

