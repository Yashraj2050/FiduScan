-- Migration 004: Create Developer API Keys table
-- (Note: SQLAlchemy handles initial creation, this script acts as explicit DDL for migrations/rollbacks)

CREATE TABLE IF NOT EXISTS developer_api_keys (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(user_id),
    key_hash VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP WITH TIME ZONE,
    revoked INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS ix_developer_api_keys_id ON developer_api_keys(id);
CREATE INDEX IF NOT EXISTS ix_developer_api_keys_user_id ON developer_api_keys(user_id);
