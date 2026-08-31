-- supabase/migrations/0001_fiduscan_initial_schema.sql
-- Idempotent FiduScan V6 Schema Initialization

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS audio_watermarks (
	id SERIAL NOT NULL, 
	file_hash VARCHAR, 
	watermark_payload VARCHAR, 
	extracted BOOLEAN, 
	created_at TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS ix_audio_watermarks_id ON audio_watermarks (id);

CREATE INDEX IF NOT EXISTS ix_audio_watermarks_file_hash ON audio_watermarks (file_hash);

CREATE TABLE IF NOT EXISTS blockchain_anchors (
	id SERIAL NOT NULL, 
	evidence_id INTEGER, 
	file_hash VARCHAR, 
	report_hash VARCHAR, 
	anchor_hash VARCHAR, 
	network VARCHAR, 
	transaction_id VARCHAR, 
	timestamp TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id), 
	UNIQUE (transaction_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_blockchain_anchors_anchor_hash ON blockchain_anchors (anchor_hash);

CREATE INDEX IF NOT EXISTS ix_blockchain_anchors_id ON blockchain_anchors (id);

CREATE INDEX IF NOT EXISTS ix_blockchain_anchors_evidence_id ON blockchain_anchors (evidence_id);

DO $$ BEGIN
    CREATE TYPE resourcetype AS ENUM ('CASE', 'EVIDENCE', 'REPORT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE integrationtype AS ENUM ('SLACK', 'TEAMS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
	user_id VARCHAR NOT NULL, 
	email VARCHAR NOT NULL, 
	password_hash VARCHAR NOT NULL, 
	role VARCHAR, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	last_login TIMESTAMP WITH TIME ZONE, 
	PRIMARY KEY (user_id)
);

CREATE INDEX IF NOT EXISTS ix_users_user_id ON users (user_id);

CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON users (email);

CREATE TABLE IF NOT EXISTS trust_analysis_logs (
	id VARCHAR NOT NULL, 
	case_id VARCHAR, 
	evidence_id VARCHAR, 
	risk_score INTEGER NOT NULL, 
	risk_level VARCHAR NOT NULL, 
	decision VARCHAR NOT NULL, 
	metadata_json JSON, 
	model_result_json JSON, 
	timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS ix_trust_analysis_logs_case_id ON trust_analysis_logs (case_id);

CREATE INDEX IF NOT EXISTS ix_trust_analysis_logs_evidence_id ON trust_analysis_logs (evidence_id);

CREATE INDEX IF NOT EXISTS ix_trust_analysis_logs_timestamp ON trust_analysis_logs (timestamp);

CREATE INDEX IF NOT EXISTS ix_trust_analysis_logs_id ON trust_analysis_logs (id);

CREATE TABLE IF NOT EXISTS organizations (
	org_id VARCHAR NOT NULL, 
	name VARCHAR NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (org_id)
);

CREATE INDEX IF NOT EXISTS ix_organizations_org_id ON organizations (org_id);

CREATE TABLE IF NOT EXISTS billing_events (
	id VARCHAR NOT NULL, 
	event_type VARCHAR NOT NULL, 
	payload JSON NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS ix_billing_events_id ON billing_events (id);

CREATE TABLE IF NOT EXISTS scans (
	scan_id VARCHAR NOT NULL, 
	user_id VARCHAR NOT NULL, 
	modality VARCHAR NOT NULL, 
	filename VARCHAR NOT NULL, 
	prediction VARCHAR NOT NULL, 
	confidence VARCHAR NOT NULL, 
	timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (scan_id), 
	FOREIGN KEY(user_id) REFERENCES users (user_id)
);

CREATE INDEX IF NOT EXISTS ix_scans_scan_id ON scans (scan_id);

CREATE TABLE IF NOT EXISTS audit_logs (
	log_id SERIAL NOT NULL, 
	user_id VARCHAR NOT NULL, 
	action VARCHAR NOT NULL, 
	timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	metadata_json JSON, 
	PRIMARY KEY (log_id), 
	FOREIGN KEY(user_id) REFERENCES users (user_id)
);

CREATE INDEX IF NOT EXISTS ix_audit_logs_log_id ON audit_logs (log_id);

CREATE TABLE IF NOT EXISTS organization_members (
	id SERIAL NOT NULL, 
	org_id VARCHAR, 
	user_id VARCHAR, 
	role VARCHAR NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(org_id) REFERENCES organizations (org_id), 
	FOREIGN KEY(user_id) REFERENCES users (user_id)
);

CREATE INDEX IF NOT EXISTS ix_organization_members_id ON organization_members (id);

CREATE TABLE IF NOT EXISTS workspaces (
	workspace_id VARCHAR NOT NULL, 
	org_id VARCHAR, 
	name VARCHAR NOT NULL, 
	PRIMARY KEY (workspace_id), 
	FOREIGN KEY(org_id) REFERENCES organizations (org_id)
);

CREATE INDEX IF NOT EXISTS ix_workspaces_workspace_id ON workspaces (workspace_id);

CREATE TABLE IF NOT EXISTS subscriptions (
	id VARCHAR NOT NULL, 
	user_id VARCHAR NOT NULL, 
	stripe_customer_id VARCHAR NOT NULL, 
	stripe_subscription_id VARCHAR NOT NULL, 
	plan VARCHAR NOT NULL, 
	status VARCHAR NOT NULL, 
	current_period_end TIMESTAMP WITH TIME ZONE NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (user_id)
);

CREATE INDEX IF NOT EXISTS ix_subscriptions_id ON subscriptions (id);

CREATE TABLE IF NOT EXISTS usage_tracking (
	id SERIAL NOT NULL, 
	user_id VARCHAR NOT NULL, 
	image_scans INTEGER, 
	audio_scans INTEGER, 
	video_scans INTEGER, 
	api_calls INTEGER, 
	storage_used INTEGER, 
	reset_date TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (user_id)
);

CREATE INDEX IF NOT EXISTS ix_usage_tracking_id ON usage_tracking (id);

CREATE TABLE IF NOT EXISTS developer_api_keys (
	id VARCHAR NOT NULL, 
	user_id VARCHAR NOT NULL, 
	key_hash VARCHAR NOT NULL, 
	name VARCHAR NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	last_used_at TIMESTAMP WITH TIME ZONE, 
	revoked INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (user_id)
);

CREATE INDEX IF NOT EXISTS ix_developer_api_keys_id ON developer_api_keys (id);

CREATE TABLE IF NOT EXISTS identity_providers (
	idp_id VARCHAR NOT NULL, 
	org_id VARCHAR NOT NULL, 
	name VARCHAR NOT NULL, 
	protocol VARCHAR NOT NULL, 
	status VARCHAR, 
	is_primary BOOLEAN, 
	saml_entity_id VARCHAR, 
	saml_sso_url VARCHAR, 
	saml_slo_url VARCHAR, 
	saml_x509_cert TEXT, 
	saml_sp_entity_id VARCHAR, 
	saml_acs_url VARCHAR, 
	saml_name_id_format VARCHAR, 
	saml_sign_requests BOOLEAN, 
	saml_want_assertions_signed BOOLEAN, 
	saml_attribute_email VARCHAR, 
	saml_attribute_name VARCHAR, 
	saml_attribute_groups VARCHAR, 
	oidc_client_id VARCHAR, 
	oidc_client_secret VARCHAR, 
	oidc_issuer_url VARCHAR, 
	oidc_authorization_endpoint VARCHAR, 
	oidc_token_endpoint VARCHAR, 
	oidc_userinfo_endpoint VARCHAR, 
	oidc_jwks_uri VARCHAR, 
	oidc_scopes JSON, 
	oidc_redirect_uri VARCHAR, 
	azure_tenant_id VARCHAR, 
	azure_directory_id VARCHAR, 
	google_hd VARCHAR, 
	role_mapping JSON, 
	default_role VARCHAR, 
	jit_provisioning BOOLEAN, 
	enforce_mfa BOOLEAN, 
	session_max_age INTEGER, 
	allowed_clock_skew INTEGER, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	updated_at TIMESTAMP WITH TIME ZONE, 
	last_used_at TIMESTAMP WITH TIME ZONE, 
	error_message TEXT, 
	PRIMARY KEY (idp_id), 
	CONSTRAINT uq_org_saml_entity UNIQUE (org_id, saml_entity_id), 
	FOREIGN KEY(org_id) REFERENCES organizations (org_id)
);

CREATE INDEX IF NOT EXISTS ix_identity_providers_org_id ON identity_providers (org_id);

CREATE INDEX IF NOT EXISTS ix_identity_providers_idp_id ON identity_providers (idp_id);

CREATE TABLE IF NOT EXISTS enterprise_audit_logs (
	id VARCHAR NOT NULL, 
	org_id VARCHAR NOT NULL, 
	user_id VARCHAR, 
	event_type VARCHAR NOT NULL, 
	resource_type VARCHAR, 
	resource_id VARCHAR, 
	action VARCHAR NOT NULL, 
	ip_address VARCHAR, 
	user_agent VARCHAR, 
	metadata_json JSON, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	previous_hash VARCHAR NOT NULL, 
	log_hash VARCHAR NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(org_id) REFERENCES organizations (org_id), 
	FOREIGN KEY(user_id) REFERENCES users (user_id), 
	UNIQUE (log_hash)
);

CREATE INDEX IF NOT EXISTS ix_enterprise_audit_logs_org_id ON enterprise_audit_logs (org_id);

CREATE INDEX IF NOT EXISTS ix_enterprise_audit_logs_created_at ON enterprise_audit_logs (created_at);

CREATE INDEX IF NOT EXISTS ix_enterprise_audit_logs_event_type ON enterprise_audit_logs (event_type);

CREATE INDEX IF NOT EXISTS ix_enterprise_audit_logs_id ON enterprise_audit_logs (id);

CREATE INDEX IF NOT EXISTS ix_enterprise_audit_logs_action ON enterprise_audit_logs (action);

CREATE INDEX IF NOT EXISTS ix_enterprise_audit_logs_user_id ON enterprise_audit_logs (user_id);

CREATE TABLE IF NOT EXISTS org_audit_configs (
	org_id VARCHAR NOT NULL, 
	retention_policy VARCHAR, 
	last_purged_at TIMESTAMP WITH TIME ZONE, 
	PRIMARY KEY (org_id), 
	FOREIGN KEY(org_id) REFERENCES organizations (org_id)
);

CREATE TABLE IF NOT EXISTS comments (
	id VARCHAR NOT NULL, 
	author_id VARCHAR, 
	resource_type resourcetype, 
	resource_id VARCHAR, 
	content TEXT, 
	created_at TIMESTAMP WITHOUT TIME ZONE, 
	updated_at TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(author_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS assignments (
	id VARCHAR NOT NULL, 
	resource_type resourcetype, 
	resource_id VARCHAR, 
	assignee_id VARCHAR, 
	assigner_id VARCHAR, 
	due_date TIMESTAMP WITHOUT TIME ZONE, 
	status VARCHAR, 
	PRIMARY KEY (id), 
	FOREIGN KEY(assignee_id) REFERENCES users (user_id), 
	FOREIGN KEY(assigner_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS notifications (
	id VARCHAR NOT NULL, 
	user_id VARCHAR, 
	type VARCHAR, 
	message VARCHAR, 
	read VARCHAR, 
	created_at TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS organization_integrations (
	id VARCHAR NOT NULL, 
	org_id VARCHAR, 
	integration_type integrationtype, 
	workspace_id VARCHAR, 
	webhook_url VARCHAR, 
	channel_id VARCHAR, 
	config JSON, 
	is_active BOOLEAN, 
	created_at TIMESTAMP WITHOUT TIME ZONE, 
	updated_at TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(org_id) REFERENCES organizations (org_id)
);

CREATE TABLE IF NOT EXISTS user_notification_preferences (
	id VARCHAR NOT NULL, 
	user_id VARCHAR, 
	preferences JSON, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS org_branding (
	id VARCHAR NOT NULL, 
	org_id VARCHAR, 
	logo_url VARCHAR, 
	favicon_url VARCHAR, 
	primary_color VARCHAR, 
	secondary_color VARCHAR, 
	typography VARCHAR, 
	email_sender VARCHAR, 
	email_template VARCHAR, 
	created_at TIMESTAMP WITHOUT TIME ZONE, 
	updated_at TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(org_id) REFERENCES organizations (org_id)
);

CREATE TABLE IF NOT EXISTS org_domains (
	id VARCHAR NOT NULL, 
	org_id VARCHAR, 
	domain VARCHAR, 
	is_verified BOOLEAN, 
	ssl_status VARCHAR, 
	created_at TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(org_id) REFERENCES organizations (org_id), 
	UNIQUE (domain)
);

CREATE TABLE IF NOT EXISTS api_keys (
	key_id VARCHAR NOT NULL, 
	workspace_id VARCHAR, 
	key_hash VARCHAR NOT NULL, 
	name VARCHAR NOT NULL, 
	is_active INTEGER, 
	PRIMARY KEY (key_id), 
	FOREIGN KEY(workspace_id) REFERENCES workspaces (workspace_id)
);

CREATE INDEX IF NOT EXISTS ix_api_keys_key_id ON api_keys (key_id);

CREATE TABLE IF NOT EXISTS invoices (
	id VARCHAR NOT NULL, 
	subscription_id VARCHAR, 
	amount INTEGER NOT NULL, 
	status VARCHAR NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(subscription_id) REFERENCES subscriptions (id)
);

CREATE INDEX IF NOT EXISTS ix_invoices_id ON invoices (id);

CREATE TABLE IF NOT EXISTS sso_sessions (
	session_id VARCHAR NOT NULL, 
	idp_id VARCHAR NOT NULL, 
	user_id VARCHAR NOT NULL, 
	saml_session_index VARCHAR, 
	oidc_sub VARCHAR, 
	saml_name_id VARCHAR, 
	access_token VARCHAR, 
	expires_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	is_active BOOLEAN, 
	PRIMARY KEY (session_id), 
	FOREIGN KEY(idp_id) REFERENCES identity_providers (idp_id), 
	FOREIGN KEY(user_id) REFERENCES users (user_id)
);

CREATE INDEX IF NOT EXISTS ix_sso_sessions_session_id ON sso_sessions (session_id);

CREATE TABLE IF NOT EXISTS saml_replay_cache (
	id SERIAL NOT NULL, 
	assertion_id VARCHAR NOT NULL, 
	idp_id VARCHAR NOT NULL, 
	consumed_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	expires_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(idp_id) REFERENCES identity_providers (idp_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_saml_replay_cache_assertion_id ON saml_replay_cache (assertion_id);

CREATE TABLE IF NOT EXISTS oidc_states (
	state VARCHAR NOT NULL, 
	idp_id VARCHAR NOT NULL, 
	nonce VARCHAR NOT NULL, 
	redirect_to VARCHAR, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	expires_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	PRIMARY KEY (state), 
	FOREIGN KEY(idp_id) REFERENCES identity_providers (idp_id)
);

CREATE INDEX IF NOT EXISTS ix_oidc_states_state ON oidc_states (state);

DO $$ BEGIN
    CREATE TYPE casestatus AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE prioritylevel AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS cases (
	id SERIAL NOT NULL, 
	title VARCHAR, 
	description VARCHAR, 
	owner VARCHAR, 
	status casestatus, 
	priority prioritylevel, 
	created_at TIMESTAMP WITHOUT TIME ZONE, 
	updated_at TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS ix_cases_id ON cases (id);

CREATE INDEX IF NOT EXISTS ix_cases_title ON cases (title);

CREATE TABLE IF NOT EXISTS case_evidence (
	id SERIAL NOT NULL, 
	case_id INTEGER, 
	evidence_id VARCHAR, 
	PRIMARY KEY (id), 
	FOREIGN KEY(case_id) REFERENCES cases (id)
);

CREATE INDEX IF NOT EXISTS ix_case_evidence_id ON case_evidence (id);

CREATE TABLE IF NOT EXISTS case_reports (
	id SERIAL NOT NULL, 
	case_id INTEGER, 
	report_id VARCHAR, 
	PRIMARY KEY (id), 
	FOREIGN KEY(case_id) REFERENCES cases (id)
);

CREATE INDEX IF NOT EXISTS ix_case_reports_id ON case_reports (id);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) CONFIGURATION
-- ==========================================
-- Enabling RLS prevents unauthorized direct access via the Supabase Data API.
-- The FastAPI backend connects as a superuser and naturally bypasses these policies.

-- 1. Enable RLS on all 31 tables
ALTER TABLE audio_watermarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE blockchain_anchors ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_analysis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_audit_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sso_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saml_replay_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE oidc_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_reports ENABLE ROW LEVEL SECURITY;


-- All tables are Backend-Only. Supabase Data API is disabled for security.
DROP POLICY IF EXISTS "Backend only access" ON audio_watermarks;
CREATE POLICY "Backend only access" ON audio_watermarks FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON blockchain_anchors;
CREATE POLICY "Backend only access" ON blockchain_anchors FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON users;
CREATE POLICY "Backend only access" ON users FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON trust_analysis_logs;
CREATE POLICY "Backend only access" ON trust_analysis_logs FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON organizations;
CREATE POLICY "Backend only access" ON organizations FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON billing_events;
CREATE POLICY "Backend only access" ON billing_events FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON scans;
CREATE POLICY "Backend only access" ON scans FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON audit_logs;
CREATE POLICY "Backend only access" ON audit_logs FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON organization_members;
CREATE POLICY "Backend only access" ON organization_members FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON workspaces;
CREATE POLICY "Backend only access" ON workspaces FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON subscriptions;
CREATE POLICY "Backend only access" ON subscriptions FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON usage_tracking;
CREATE POLICY "Backend only access" ON usage_tracking FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON developer_api_keys;
CREATE POLICY "Backend only access" ON developer_api_keys FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON identity_providers;
CREATE POLICY "Backend only access" ON identity_providers FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON enterprise_audit_logs;
CREATE POLICY "Backend only access" ON enterprise_audit_logs FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON org_audit_configs;
CREATE POLICY "Backend only access" ON org_audit_configs FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON comments;
CREATE POLICY "Backend only access" ON comments FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON assignments;
CREATE POLICY "Backend only access" ON assignments FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON notifications;
CREATE POLICY "Backend only access" ON notifications FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON organization_integrations;
CREATE POLICY "Backend only access" ON organization_integrations FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON user_notification_preferences;
CREATE POLICY "Backend only access" ON user_notification_preferences FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON org_branding;
CREATE POLICY "Backend only access" ON org_branding FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON org_domains;
CREATE POLICY "Backend only access" ON org_domains FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON api_keys;
CREATE POLICY "Backend only access" ON api_keys FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON invoices;
CREATE POLICY "Backend only access" ON invoices FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON sso_sessions;
CREATE POLICY "Backend only access" ON sso_sessions FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON saml_replay_cache;
CREATE POLICY "Backend only access" ON saml_replay_cache FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON oidc_states;
CREATE POLICY "Backend only access" ON oidc_states FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON cases;
CREATE POLICY "Backend only access" ON cases FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON case_evidence;
CREATE POLICY "Backend only access" ON case_evidence FOR ALL USING (false);
DROP POLICY IF EXISTS "Backend only access" ON case_reports;
CREATE POLICY "Backend only access" ON case_reports FOR ALL USING (false);
