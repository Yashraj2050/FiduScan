CREATE TABLE organizations (org_id VARCHAR PRIMARY KEY, name VARCHAR NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE organization_members (id SERIAL PRIMARY KEY, org_id VARCHAR REFERENCES organizations(org_id), user_id VARCHAR REFERENCES users(user_id), role VARCHAR NOT NULL);
CREATE TABLE workspaces (workspace_id VARCHAR PRIMARY KEY, org_id VARCHAR REFERENCES organizations(org_id), name VARCHAR NOT NULL);
CREATE TABLE api_keys (key_id VARCHAR PRIMARY KEY, workspace_id VARCHAR REFERENCES workspaces(workspace_id), key_hash VARCHAR NOT NULL, name VARCHAR NOT NULL, is_active INTEGER DEFAULT 1);
