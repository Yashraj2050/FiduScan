# Phase 5C — Usage Analytics Architecture
*Generated: 2026-05-31 01:39 IST*

## Analytics Tracking Strategy
To support future monetization and monitor platform growth, we have designed a robust, privacy-preserving usage analytics architecture.

### Tracked Metrics
- **Registrations:** Tracked via Cloud SQL `users` table timestamps.
- **Active Users:** Determined by tracking authentication token issuance (`last_login` field).
- **Scans per User:** Aggregated via the `scans` table grouping by `user_id`.
- **Modality Breakdown:** Tracked via the `modality_type` column (Image, Audio, Video).

## Infrastructure Design
- **Event Ingestion:** FastAPI backend emits structured JSON logs to Google Cloud Logging containing `user_id`, `scan_id`, `modality`, and `execution_ms`. No PII (Personally Identifiable Information) or file contents are logged.
- **Data Warehousing:** Cloud Logging is routed via a Log Sink directly into BigQuery for cost-effective, long-term aggregation.
- **Aggregation:** A scheduled dbt (Data Build Tool) job or BigQuery Scheduled Query aggregates raw logs into daily rollups (e.g., `daily_user_scans`).

**Status: ANALYTICS ARCHITECTURE DESIGNED**
