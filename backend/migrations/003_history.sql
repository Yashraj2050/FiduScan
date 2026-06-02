-- Migration 003: Create Scans History table
-- (Note: SQLAlchemy handles initial creation, this script acts as explicit DDL for migrations/rollbacks)

CREATE TABLE IF NOT EXISTS scans (
    scan_id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(user_id),
    modality VARCHAR NOT NULL,
    filename VARCHAR NOT NULL,
    prediction VARCHAR NOT NULL,
    confidence VARCHAR NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_scans_scan_id ON scans(scan_id);
CREATE INDEX IF NOT EXISTS ix_scans_user_id ON scans(user_id);
