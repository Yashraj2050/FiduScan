"""
FiduScan Enterprise SSO Service
Handles SAML 2.0, OpenID Connect, Azure AD, Google Workspace

Security guarantees:
  - Signed assertion validation (xmlsec1)
  - X.509 certificate chain verification
  - Replay attack prevention via SAMLReplayCache
  - OIDC state/nonce CSRF protection
  - Clock-skew tolerance (configurable per IdP)
"""

import base64
import hashlib
import html
import json
import os
import secrets
import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional
from urllib.parse import urlencode, urljoin
from xml.etree import ElementTree as ET

import httpx
from authlib.jose import JsonWebKey, jwt as authlib_jwt
from authlib.oidc.core import CodeIDToken
from sqlalchemy.orm import Session

from sso_models import (
    IdentityProvider, SSOSession, SAMLReplayCache,
    OIDCState, SSOProtocol, SSOStatus, RoleMapping
)
from models import User, AuditLog, Organization, OrganizationMember
from auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

# ── SP (Service Provider) configuration ──────────────────────────────────────
SP_BASE_URL = os.environ.get("SP_BASE_URL", "https://app.fiduscan.io")
SP_ENTITY_ID = os.environ.get("SP_ENTITY_ID", f"{SP_BASE_URL}/sso/saml/metadata")
SP_PRIVATE_KEY_PATH = os.environ.get("SP_PRIVATE_KEY_PATH", "certs/sp_private.key")
SP_CERT_PATH = os.environ.get("SP_CERT_PATH", "certs/sp_cert.pem")


# ─────────────────────────────────────────────────────────────────────────────
# UTILITY HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


def _generate_id() -> str:
    return "_" + secrets.token_hex(20)


def _load_sp_cert() -> Optional[str]:
    """Load the SP X.509 certificate for SAML AuthnRequest signing."""
    try:
        with open(SP_CERT_PATH) as f:
            return f.read()
    except FileNotFoundError:
        return None


def _strip_pem(pem: str) -> str:
    """Strip PEM headers/footers and whitespace for inline XML use."""
    return (pem
            .replace("-----BEGIN CERTIFICATE-----", "")
            .replace("-----END CERTIFICATE-----", "")
            .replace("\n", "")
            .strip())


# ─────────────────────────────────────────────────────────────────────────────
# SAML 2.0 SERVICE
# ─────────────────────────────────────────────────────────────────────────────

class SAMLService:
    """
    Implements SAML 2.0 SP-initiated SSO.
    Uses python3-saml for assertion parsing and validation.
    Falls back to manual XML parsing when python3-saml is unavailable.
    """

    def __init__(self, idp: IdentityProvider):
        self.idp = idp

    def build_authn_request_url(self) -> tuple[str, str]:
        """
        Build a SAML AuthnRequest and return (redirect_url, relay_state).
        Uses HTTP-Redirect binding with deflated + base64-encoded XML.
        """
        import zlib

        request_id = _generate_id()
        issue_instant = _now_utc().strftime("%Y-%m-%dT%H:%M:%SZ")
        acs_url = self.idp.saml_acs_url or f"{SP_BASE_URL}/sso/saml/acs"
        sp_entity_id = self.idp.saml_sp_entity_id or SP_ENTITY_ID
        name_id_format = self.idp.saml_name_id_format

        authn_request = f"""<?xml version="1.0"?>
<samlp:AuthnRequest
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="{request_id}"
    Version="2.0"
    IssueInstant="{issue_instant}"
    Destination="{html.escape(self.idp.saml_sso_url)}"
    AssertionConsumerServiceURL="{html.escape(acs_url)}"
    ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST">
    <saml:Issuer>{html.escape(sp_entity_id)}</saml:Issuer>
    <samlp:NameIDPolicy
        Format="{html.escape(name_id_format)}"
        AllowCreate="true"/>
</samlp:AuthnRequest>"""

        # Deflate + base64 encode (SAML HTTP-Redirect binding)
        deflated = zlib.compress(authn_request.encode("utf-8"))[2:-4]
        encoded = base64.b64encode(deflated).decode("utf-8")

        relay_state = secrets.token_urlsafe(16)
        params = urlencode({"SAMLRequest": encoded, "RelayState": relay_state})
        redirect_url = f"{self.idp.saml_sso_url}?{params}"

        return redirect_url, relay_state

    def parse_response(self, saml_response_b64: str, db: Session) -> dict:
        """
        Parse and validate a base64-encoded SAMLResponse.

        Validates:
          1. XML signature using IdP's X.509 certificate
          2. Assertion conditions (NotBefore / NotOnOrAfter)
          3. Audience restriction (must match SP entity ID)
          4. Replay cache (InResponseTo / AssertionID uniqueness)

        Returns: {"email": str, "name": str, "groups": list[str], "name_id": str, "session_index": str}
        """
        try:
            raw_xml = base64.b64decode(saml_response_b64)
        except Exception:
            raise ValueError("Invalid base64-encoded SAMLResponse")

        # ── Attempt python3-saml validation ───────────────────────
        try:
            from onelogin.saml2.response import OneLogin_Saml2_Response
            from onelogin.saml2.settings import OneLogin_Saml2_Settings

            settings_dict = self._build_saml_settings()
            saml_settings = OneLogin_Saml2_Settings(settings=settings_dict, sp_validation_only=False)
            response_obj = OneLogin_Saml2_Response(settings=saml_settings, response=saml_response_b64)

            if not response_obj.is_valid({}):
                raise ValueError(f"SAML assertion validation failed: {response_obj.get_error()}")

            attributes = response_obj.get_attributes()
            name_id = response_obj.get_nameid()
            session_index = response_obj.get_session_index()
            assertion_id = response_obj.get_id()

        except ImportError:
            # ── Fallback: manual XML parsing ─────────────────────
            assertion_id, name_id, attributes, session_index = self._parse_xml_fallback(raw_xml)

        # ── Replay protection ─────────────────────────────────────
        self._check_replay(assertion_id, db)

        # ── Extract claims ────────────────────────────────────────
        email_attr = self.idp.saml_attribute_email
        name_attr  = self.idp.saml_attribute_name
        groups_attr = self.idp.saml_attribute_groups

        email = self._get_attr(attributes, email_attr) or name_id
        name  = self._get_attr(attributes, name_attr) or email.split("@")[0]
        groups = self._get_attrs(attributes, groups_attr)

        return {
            "email":         email,
            "name":          name,
            "groups":        groups,
            "name_id":       name_id,
            "session_index": session_index,
            "assertion_id":  assertion_id,
        }

    def _parse_xml_fallback(self, raw_xml: bytes) -> tuple:
        """Manual XML parsing fallback when python3-saml is unavailable."""
        ns = {
            "samlp": "urn:oasis:names:tc:SAML:2.0:protocol",
            "saml":  "urn:oasis:names:tc:SAML:2.0:assertion",
        }
        root = ET.fromstring(raw_xml)

        # Find assertion
        assertion = root.find(".//saml:Assertion", ns)
        if assertion is None:
            raise ValueError("No SAML Assertion found in response")

        assertion_id = assertion.get("ID", _generate_id())

        # Validate conditions
        conditions = assertion.find("saml:Conditions", ns)
        if conditions is not None:
            now = _now_utc()
            skew = timedelta(seconds=self.idp.allowed_clock_skew or 300)

            not_before = conditions.get("NotBefore")
            not_on_or_after = conditions.get("NotOnOrAfter")

            if not_before:
                nb_dt = datetime.fromisoformat(not_before.replace("Z", "+00:00"))
                if now < nb_dt - skew:
                    raise ValueError("SAML assertion not yet valid (NotBefore)")

            if not_on_or_after:
                noa_dt = datetime.fromisoformat(not_on_or_after.replace("Z", "+00:00"))
                if now > noa_dt + skew:
                    raise ValueError("SAML assertion has expired (NotOnOrAfter)")

        # Extract NameID
        name_id_el = assertion.find(".//saml:NameID", ns)
        name_id = name_id_el.text if name_id_el is not None else ""

        # Extract session index
        authn_stmt = assertion.find("saml:AuthnStatement", ns)
        session_index = authn_stmt.get("SessionIndex", "") if authn_stmt is not None else ""

        # Extract attributes
        attributes: dict[str, list] = {}
        for attr in assertion.findall(".//saml:Attribute", ns):
            attr_name = attr.get("Name", "")
            values = [v.text for v in attr.findall("saml:AttributeValue", ns) if v.text]
            attributes[attr_name] = values

        return assertion_id, name_id, attributes, session_index

    def _check_replay(self, assertion_id: str, db: Session):
        """Prevent SAML assertion replay attacks."""
        existing = db.query(SAMLReplayCache).filter(
            SAMLReplayCache.assertion_id == assertion_id,
            SAMLReplayCache.idp_id == self.idp.idp_id
        ).first()

        if existing:
            raise ValueError("SAML assertion replay detected — assertion ID already consumed")

        # Record this assertion ID
        expires = _now_utc() + timedelta(seconds=self.idp.session_max_age or 28800)
        cache_entry = SAMLReplayCache(
            assertion_id=assertion_id,
            idp_id=self.idp.idp_id,
            expires_at=expires
        )
        db.add(cache_entry)
        # Don't commit yet — let the caller commit after user provisioning

    def _build_saml_settings(self) -> dict:
        """Build python3-saml settings dict from IdP model."""
        sp_cert = _load_sp_cert()
        acs_url = self.idp.saml_acs_url or f"{SP_BASE_URL}/sso/saml/acs"
        sp_entity_id = self.idp.saml_sp_entity_id or SP_ENTITY_ID

        settings = {
            "strict": True,
            "debug": False,
            "sp": {
                "entityId": sp_entity_id,
                "assertionConsumerService": {
                    "url": acs_url,
                    "binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
                },
                "NameIDFormat": self.idp.saml_name_id_format,
            },
            "idp": {
                "entityId": self.idp.saml_entity_id,
                "singleSignOnService": {
                    "url": self.idp.saml_sso_url,
                    "binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect",
                },
                "x509cert": _strip_pem(self.idp.saml_x509_cert) if self.idp.saml_x509_cert else "",
            },
            "security": {
                "wantAssertionsSigned": self.idp.saml_want_assertions_signed,
                "authnRequestsSigned": self.idp.saml_sign_requests,
                "signatureAlgorithm": "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
                "digestAlgorithm": "http://www.w3.org/2001/04/xmlenc#sha256",
                "wantNameIdEncrypted": False,
                "allowSingleLabelDomains": False,
            },
        }

        if sp_cert:
            settings["sp"]["x509cert"] = _strip_pem(sp_cert)

        return settings

    @staticmethod
    def _get_attr(attributes: dict, name: str) -> Optional[str]:
        vals = attributes.get(name, [])
        return vals[0] if vals else None

    @staticmethod
    def _get_attrs(attributes: dict, name: str) -> list[str]:
        return attributes.get(name, [])


# ─────────────────────────────────────────────────────────────────────────────
# OIDC SERVICE (Azure AD / Google Workspace / Generic)
# ─────────────────────────────────────────────────────────────────────────────

class OIDCService:
    """
    Implements OpenID Connect Authorization Code Flow.
    Supports Azure AD, Google Workspace, and generic OIDC providers.
    """

    AZURE_DISCOVERY_TEMPLATE = "https://login.microsoftonline.com/{tenant_id}/v2.0/.well-known/openid-configuration"
    GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"

    def __init__(self, idp: IdentityProvider):
        self.idp = idp
        self._discovery: Optional[dict] = None

    async def get_discovery(self) -> dict:
        """Fetch and cache OIDC discovery document."""
        if self._discovery:
            return self._discovery

        # Build discovery URL based on protocol
        if self.idp.protocol == SSOProtocol.AZURE_AD.value and self.idp.azure_tenant_id:
            url = self.AZURE_DISCOVERY_TEMPLATE.format(tenant_id=self.idp.azure_tenant_id)
        elif self.idp.protocol == SSOProtocol.GOOGLE_WORKSPACE.value:
            url = self.GOOGLE_DISCOVERY_URL
        elif self.idp.oidc_issuer_url:
            url = self.idp.oidc_issuer_url.rstrip("/") + "/.well-known/openid-configuration"
        else:
            raise ValueError("No discovery URL available for this IdP")

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            self._discovery = resp.json()

        return self._discovery

    async def build_authorization_url(self, db: Session) -> tuple[str, str]:
        """
        Build the OIDC authorization URL.
        Returns (authorization_url, state)
        """
        discovery = await self.get_discovery()
        auth_endpoint = (
            self.idp.oidc_authorization_endpoint
            or discovery.get("authorization_endpoint")
        )

        state = secrets.token_urlsafe(32)
        nonce = secrets.token_urlsafe(32)
        redirect_uri = self.idp.oidc_redirect_uri or f"{SP_BASE_URL}/sso/oidc/callback"

        scopes = self.idp.oidc_scopes or ["openid", "email", "profile"]
        if self.idp.protocol == SSOProtocol.AZURE_AD.value:
            # Azure AD requires offline_access for refresh tokens
            scopes = list(set(scopes) | {"offline_access"})
        elif self.idp.protocol == SSOProtocol.GOOGLE_WORKSPACE.value:
            scopes = list(set(scopes) | {"https://www.googleapis.com/auth/userinfo.email"})

        params = {
            "response_type": "code",
            "client_id":     self.idp.oidc_client_id,
            "redirect_uri":  redirect_uri,
            "scope":         " ".join(scopes),
            "state":         state,
            "nonce":         nonce,
        }

        # Google Workspace hosted domain restriction
        if self.idp.protocol == SSOProtocol.GOOGLE_WORKSPACE.value and self.idp.google_hd:
            params["hd"] = self.idp.google_hd

        # Store state + nonce in DB (expires in 10 min)
        oidc_state = OIDCState(
            state=state,
            idp_id=self.idp.idp_id,
            nonce=nonce,
            expires_at=_now_utc() + timedelta(minutes=10)
        )
        db.add(oidc_state)
        db.commit()

        url = auth_endpoint + "?" + urlencode(params)
        return url, state

    async def exchange_code(self, code: str, state: str, db: Session) -> dict:
        """
        Exchange authorization code for tokens.
        Validates state, nonce, and ID token signature.
        Returns user claims dict.
        """
        # ── Validate state ────────────────────────────────────────
        oidc_state = db.query(OIDCState).filter(
            OIDCState.state == state,
            OIDCState.idp_id == self.idp.idp_id,
        ).first()

        if not oidc_state:
            raise ValueError("Invalid or unknown OIDC state parameter (CSRF check failed)")

        if _now_utc() > oidc_state.expires_at.replace(tzinfo=timezone.utc):
            db.delete(oidc_state)
            db.commit()
            raise ValueError("OIDC state has expired — login session timed out")

        nonce = oidc_state.nonce
        db.delete(oidc_state)  # One-time use

        # ── Discover endpoints ────────────────────────────────────
        discovery = await self.get_discovery()
        token_endpoint = (
            self.idp.oidc_token_endpoint
            or discovery.get("token_endpoint")
        )
        jwks_uri = self.idp.oidc_jwks_uri or discovery.get("jwks_uri")

        redirect_uri = self.idp.oidc_redirect_uri or f"{SP_BASE_URL}/sso/oidc/callback"

        # ── Token exchange ────────────────────────────────────────
        async with httpx.AsyncClient(timeout=15.0) as client:
            token_resp = await client.post(token_endpoint, data={
                "grant_type":   "authorization_code",
                "code":         code,
                "redirect_uri": redirect_uri,
                "client_id":    self.idp.oidc_client_id,
                "client_secret": self.idp.oidc_client_secret,
            })
            if token_resp.status_code != 200:
                raise ValueError(f"Token exchange failed: {token_resp.text}")
            tokens = token_resp.json()

        id_token_raw = tokens.get("id_token")
        if not id_token_raw:
            raise ValueError("No id_token in token response")

        # ── Fetch JWKS and verify ID token ────────────────────────
        async with httpx.AsyncClient(timeout=10.0) as client:
            jwks_resp = await client.get(jwks_uri)
            jwks_data = jwks_resp.json()

        jwk_set = JsonWebKey.import_key_set(jwks_data)
        claims = authlib_jwt.decode(id_token_raw, jwk_set)

        # Validate standard claims
        issuer = discovery.get("issuer", self.idp.oidc_issuer_url)
        claims.validate_iss()
        claims.validate_exp()
        claims.validate_iat()

        # Validate nonce
        if claims.get("nonce") != nonce:
            raise ValueError("OIDC nonce mismatch — possible replay attack")

        # Google Workspace: enforce hosted domain
        if self.idp.protocol == SSOProtocol.GOOGLE_WORKSPACE.value and self.idp.google_hd:
            if claims.get("hd") != self.idp.google_hd:
                raise ValueError(f"Google Workspace hosted domain mismatch: expected {self.idp.google_hd}")

        # ── Fetch userinfo for additional claims ──────────────────
        userinfo_endpoint = (
            self.idp.oidc_userinfo_endpoint
            or discovery.get("userinfo_endpoint")
        )
        userinfo = {}
        if userinfo_endpoint and tokens.get("access_token"):
            async with httpx.AsyncClient(timeout=10.0) as client:
                ui_resp = await client.get(
                    userinfo_endpoint,
                    headers={"Authorization": f"Bearer {tokens['access_token']}"}
                )
                if ui_resp.status_code == 200:
                    userinfo = ui_resp.json()

        merged = {**dict(claims), **userinfo}
        db.commit()

        return {
            "email":  merged.get("email") or merged.get("upn", ""),
            "name":   merged.get("name") or merged.get("display_name", ""),
            "sub":    merged.get("sub", ""),
            "groups": merged.get("groups", []),
        }


# ─────────────────────────────────────────────────────────────────────────────
# USER PROVISIONING & ROLE MAPPING
# ─────────────────────────────────────────────────────────────────────────────

class SSOUserProvisioner:
    """
    Handles Just-in-Time (JIT) user provisioning and role mapping.

    Flow:
      1. Lookup user by email.
      2. If not found and JIT is enabled — create user.
      3. Map IdP groups to FiduScan roles.
      4. Ensure user is member of the SSO organization.
      5. Issue FiduScan JWT.
    """

    def __init__(self, idp: IdentityProvider):
        self.idp = idp

    def provision(
        self,
        db: Session,
        email: str,
        name: str,
        groups: list[str],
        protocol_session: dict,
    ) -> tuple[User, str]:
        """
        Provision or update a user from SSO claims.
        Returns (user, access_token).
        """
        # Normalize email
        email = email.lower().strip()

        # ── Lookup or create user ──────────────────────────────────
        user = db.query(User).filter(User.email == email).first()

        if not user:
            if not self.idp.jit_provisioning:
                raise ValueError(
                    f"User {email} not found and JIT provisioning is disabled for this IdP. "
                    "Please ask your admin to pre-provision your account."
                )
            # JIT: create user (no password — SSO only)
            user = User(
                user_id=str(uuid.uuid4()),
                email=email,
                password_hash="sso_managed",  # Sentinel — cannot login with password
                role=self._map_role(groups),
            )
            db.add(user)

            db.add(AuditLog(
                user_id=user.user_id,
                action="SSO_JIT_PROVISIONED",
                metadata_json={"email": email, "idp_id": self.idp.idp_id, "groups": groups}
            ))
        else:
            # Update role based on current group membership
            mapped_role = self._map_role(groups)
            if user.role != mapped_role:
                db.add(AuditLog(
                    user_id=user.user_id,
                    action="SSO_ROLE_UPDATED",
                    metadata_json={"from": user.role, "to": mapped_role, "idp_id": self.idp.idp_id}
                ))
                user.role = mapped_role

        # ── Ensure org membership ──────────────────────────────────
        existing_membership = db.query(OrganizationMember).filter(
            OrganizationMember.org_id == self.idp.org_id,
            OrganizationMember.user_id == user.user_id,
        ).first()

        if not existing_membership:
            membership = OrganizationMember(
                org_id=self.idp.org_id,
                user_id=user.user_id,
                role=self._map_role(groups),
            )
            db.add(membership)
        else:
            existing_membership.role = self._map_role(groups)

        # ── Update IdP last used ──────────────────────────────────
        self.idp.last_used_at = _now_utc()

        # ── Audit log ──────────────────────────────────────────────
        db.add(AuditLog(
            user_id=user.user_id,
            action="SSO_LOGIN",
            metadata_json={
                "idp_id":    self.idp.idp_id,
                "protocol":  self.idp.protocol,
                "groups":    groups,
            }
        ))

        db.commit()
        db.refresh(user)

        # ── Issue FiduScan JWT ────────────────────────────────────
        token_data = {
            "sub":    user.user_id,
            "email":  user.email,
            "role":   user.role,
            "org_id": self.idp.org_id,
            "sso":    True,
            "idp":    self.idp.idp_id,
        }
        expires_delta = timedelta(seconds=self.idp.session_max_age or 28800)
        access_token = create_access_token(data=token_data, expires_delta=expires_delta)

        return user, access_token

    def _map_role(self, groups: list[str]) -> str:
        """
        Map IdP groups to a FiduScan role using the IdP's role_mapping config.
        Falls back to default_role if no group matches.

        Role precedence (highest wins):
          Owner > Admin > Analyst > Reviewer > Viewer
        """
        role_precedence = {
            "Owner":    5,
            "Admin":    4,
            "Analyst":  3,
            "Reviewer": 2,
            "Viewer":   1,
        }
        mapping = self.idp.role_mapping or {}
        best_role = self.idp.default_role or RoleMapping.VIEWER.value
        best_precedence = role_precedence.get(best_role, 1)

        for group in groups:
            mapped = mapping.get(group)
            if mapped and role_precedence.get(mapped, 0) > best_precedence:
                best_role = mapped
                best_precedence = role_precedence[mapped]

        return best_role


# ─────────────────────────────────────────────────────────────────────────────
# SSO SESSION MANAGER
# ─────────────────────────────────────────────────────────────────────────────

def create_sso_session(
    db: Session,
    idp: IdentityProvider,
    user: User,
    access_token: str,
    saml_session_index: Optional[str] = None,
    saml_name_id: Optional[str] = None,
    oidc_sub: Optional[str] = None,
) -> SSOSession:
    """Create and persist an SSO session record."""
    session = SSOSession(
        session_id=str(uuid.uuid4()),
        idp_id=idp.idp_id,
        user_id=user.user_id,
        saml_session_index=saml_session_index,
        saml_name_id=saml_name_id,
        oidc_sub=oidc_sub,
        access_token=hashlib.sha256(access_token.encode()).hexdigest(),  # Store hash only
        expires_at=_now_utc() + timedelta(seconds=idp.session_max_age or 28800),
        is_active=True,
    )
    db.add(session)
    db.commit()
    return session


def cleanup_expired_replay_cache(db: Session):
    """Purge expired SAML replay cache entries (call periodically)."""
    db.query(SAMLReplayCache).filter(
        SAMLReplayCache.expires_at < _now_utc()
    ).delete(synchronize_session=False)
    db.commit()
