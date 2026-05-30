# Phase 5C — User Activity Dashboard
*Generated: 2026-05-31 01:39 IST*

## Internal Admin Dashboard Design
An internal dashboard will be constructed to visualize the telemetry and analytics data for the operations team.

### Dashboard Tooling
- **Platform:** Metabase or Google Looker Studio connected directly to the BigQuery analytics dataset.
- **Access:** Restricted strictly to internal FiduScan administrators via SSO.

### Key Performance Indicators (KPIs) Visualized
- **Active Users:** Daily Active Users (DAU), Weekly Active Users (WAU), Monthly Active Users (MAU).
- **Scan Throughput:** Total scans processed per day.
- **Modality Distribution:** Pie chart breaking down scans into Image vs. Audio vs. Video.
- **Storage Consumption:** Total GBs residing in the `quarantine` and `processed` GCS buckets, mapped against cloud costs.

**Status: ADMIN DASHBOARD DESIGNED**
