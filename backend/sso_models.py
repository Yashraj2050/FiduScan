"""
Enterprise SSO Models — FiduScan v6.4
Supports SAML 2.0, OpenID Connect, Azure AD, Google Workspace
"""

from sqlalchemy import (
    Column, String, Integer, Boolean, DateTime,
    ForeignKey, JSON, Text, UniqueConstraint, Enum
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from database import Base


class SSOProtocol(str, enum.Enum):
    SAML2 = "saml2"
    OIDC = "oidc"
    AZURE_AD = "azure_ad"
    GOOGLE_WORKSPACE = "google_workspace"


class SSOStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    DISABLED = "disabled"
    ERROR = "error"


class RoleMapping(str, enum.Enum):
    """Maps IdP groups/roles to FiduScan roles."""
    OWNER = "Owner"
    ADMIN = "Admin"
    ANALYST = "Analyst"
    REVIEWER = "Reviewer"
    VIEWER = "Viewer"


class IdentityProvider(Base):
    """
    Stores SSO/IdP configuration per organization.
    Supports SAML 2.0, OIDC, Azure AD, Google Workspace.
    One active IdP per organization (can have multiple for migration).
    """
    __tablename__ = "identity_providers"

    idp_id           = Column(String, primary_key=True, index=True)
    org_id           = Column(String, ForeignKey("organizations.org_id"), nullable=False, index=True)
    name             = Column(String, nullable=False)                  # "Acme Corp Azure AD"
    protocol         = Column(String, nullable=False)                  # SSOProtocol enum value
    status           = Column(String, default=SSOStatus.PENDING.value)
    is_primary       = Column(Boolean, default=False)                  # Only one primary per org

    # ── SAML 2.0 fields ──────────────────────────────────────────
    saml_entity_id        = Column(String, nullable=True)             # IdP Entity ID (Issuer)
    saml_sso_url          = Column(String, nullable=True)             # IdP SSO endpoint (POST binding)
    saml_slo_url          = Column(String, nullable=True)             # IdP SLO endpoint (optional)
    saml_x509_cert        = Column(Text, nullable=True)               # IdP signing certificate (PEM)
    saml_sp_entity_id     = Column(String, nullable=True)             # Our SP entity ID
    saml_acs_url          = Column(String, nullable=True)             # Our ACS (Assertion Consumer Service)
    saml_name_id_format   = Column(String, default="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress")
    saml_sign_requests    = Column(Boolean, default=True)             # Sign AuthnRequest
    saml_want_assertions_signed = Column(Boolean, default=True)       # Require signed assertions
    saml_attribute_email  = Column(String, default="email")           # Attribute name for email
    saml_attribute_name   = Column(String, default="displayName")     # Attribute name for full name
    saml_attribute_groups = Column(String, default="groups")          # Attribute name for groups

    # ── OIDC / Azure AD / Google fields ──────────────────────────
    oidc_client_id        = Column(String, nullable=True)
    oidc_client_secret    = Column(String, nullable=True)             # Stored encrypted
    oidc_issuer_url       = Column(String, nullable=True)             # Well-known discovery URL
    oidc_authorization_endpoint = Column(String, nullable=True)
    oidc_token_endpoint   = Column(String, nullable=True)
    oidc_userinfo_endpoint= Column(String, nullable=True)
    oidc_jwks_uri         = Column(String, nullable=True)
    oidc_scopes           = Column(JSON, default=["openid", "email", "profile"])
    oidc_redirect_uri     = Column(String, nullable=True)

    # ── Azure AD specific ─────────────────────────────────────────
    azure_tenant_id       = Column(String, nullable=True)
    azure_directory_id    = Column(String, nullable=True)

    # ── Google Workspace specific ─────────────────────────────────
    google_hd             = Column(String, nullable=True)             # Hosted domain constraint

    # ── Role mapping ──────────────────────────────────────────────
    # JSON: {"IdP-group-name": "FiduScan-role"}
    # e.g. {"forensics-admins": "Admin", "analysts": "Analyst"}
    role_mapping          = Column(JSON, default={})
    default_role          = Column(String, default=RoleMapping.VIEWER.value)
    jit_provisioning      = Column(Boolean, default=True)             # Auto-create users on first login

    # ── Security ──────────────────────────────────────────────────
    enforce_mfa           = Column(Boolean, default=False)
    session_max_age       = Column(Integer, default=28800)            # 8 hours in seconds
    allowed_clock_skew    = Column(Integer, default=300)              # 5 min SAML replay tolerance

    # ── Metadata ──────────────────────────────────────────────────
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    updated_at   = Column(DateTime(timezone=True), onupdate=func.now())
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    error_message= Column(Text, nullable=True)

    organization = relationship("Organization", back_populates="identity_providers")
    sso_sessions = relationship("SSOSession", back_populates="idp")

    __table_args__ = (
        UniqueConstraint("org_id", "saml_entity_id", name="uq_org_saml_entity"),
    )


class SSOSession(Base):
    """
    Tracks active SSO sessions for replay protection and single logout.
    """
    __tablename__ = "sso_sessions"

    session_id      = Column(String, primary_key=True, index=True)
    idp_id          = Column(String, ForeignKey("identity_providers.idp_id"), nullable=False)
    user_id         = Column(String, ForeignKey("users.user_id"), nullable=False)
    saml_session_index = Column(String, nullable=True)               # For SAML SLO
    oidc_sub        = Column(String, nullable=True)                  # OIDC subject
    saml_name_id    = Column(String, nullable=True)                  # For SAML SLO
    access_token    = Column(String, nullable=True)                  # FiduScan JWT issued
    expires_at      = Column(DateTime(timezone=True), nullable=False)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    is_active       = Column(Boolean, default=True)

    idp  = relationship("IdentityProvider", back_populates="sso_sessions")
    user = relationship("User")


class SAMLReplayCache(Base):
    """
    Stores consumed SAML assertion IDs to prevent replay attacks.
    Entries expire after the assertion validity window.
    """
    __tablename__ = "saml_replay_cache"

    id            = Column(Integer, primary_key=True, autoincrement=True)
    assertion_id  = Column(String, unique=True, nullable=False, index=True)
    idp_id        = Column(String, ForeignKey("identity_providers.idp_id"), nullable=False)
    consumed_at   = Column(DateTime(timezone=True), server_default=func.now())
    expires_at    = Column(DateTime(timezone=True), nullable=False)


class OIDCState(Base):
    """
    Stores OIDC authorization state parameters (CSRF protection).
    One-time use, expires in 10 minutes.
    """
    __tablename__ = "oidc_states"

    state      = Column(String, primary_key=True, index=True)
    idp_id     = Column(String, ForeignKey("identity_providers.idp_id"), nullable=False)
    nonce      = Column(String, nullable=False)
    redirect_to= Column(String, nullable=True)                       # Post-login redirect URL
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)
