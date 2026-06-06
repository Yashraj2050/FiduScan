
# Production Storage Plan

## Provider Evaluation
1. **AWS S3**: Highly reliable, ecosystem integrated, but expensive egress ($0.09/GB).
2. **Cloudflare R2**: S3-compatible, fast global CDN, **zero egress fees**.
3. **Supabase Storage**: Postgres integrated, great for small to medium apps, but R2 is more cost-effective at scale.

**Recommendation**: Cloudflare R2 (S3-compatible, no egress).

## Cost Analysis
- **1k users** (approx 1TB storage, 5TB egress): $15/mo (R2) vs $473/mo (S3)
- **10k users** (approx 10TB storage, 50TB egress): $150/mo (R2) vs $4,700/mo (S3)
- **100k users** (approx 100TB storage, 500TB egress): $1,500/mo (R2) vs $47,000/mo (S3)

## Migration Plan
1. Deprecate local disk storage.
2. Implement S3-compatible Boto3 client pointing to R2 endpoint.
3. Migrate existing SQLite blobs / local files using a background worker script.
