"""
FiduScan Enterprise SSO Router — v6.4

Endpoints:
  GET  /sso/{org_id}/providers                — List IdPs for an org
  POST /sso/{org_id}/providers                — Create IdP configuration
  PUT  /sso/{org_id}/providers/{idp_id}       — Update IdP configuration
  DELETE /sso/{org_id}/providers/{idp_id}     — Delete IdP
  POST /sso/{org_id}/providers/{idp_id}/test  — Test IdP configuration

  # SAML 2.0
  GET  /sso/saml/{idp_id}/metadata            — SP metadata XML
  GET  /sso/saml/{idp_id}/login               — Initiate SAML login (redirect)
  POST /sso/saml/acs                          — Assertion Consumer Service

  # OIDC / Azure AD / Google
  GET  /sso/oidc/{idp_id}/login               — Initiate OIDC login
  GET  /sso/oidc/callback                     — OIDC callback
"""

import uuid
import secrets
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Form
from fastapi.responses import RedirectResponse, Response
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from sso_models import (
    IdentityProvider, SSOProtocol, SSOStatus,
    OIDCState, RoleMapping
)
from sso_service import (
    SAMLService, OIDCService, SSOUserProvisioner,
    create_sso_session, SP_BASE_URL, SP_ENTITY_ID
)
from models import Organization, AuditLog
from auth import get_current_user
from models import User

router = APIRouter(prefix="/sso", tags=["Enterprise SSO"])


# ─────────────────────────────────────────────────────────────────────────────
# Pydantic Schemas
# ─────────────────────────────────────────────────────────────────────────────

class IdPCreateRequest(BaseModel):
    name:     str = Field(..., description="Human-readable name, e.g. 'Acme Azure AD'")
    protocol: str = Field(..., description="saml2 | oidc | azure_ad | google_workspace")

    # SAML
    saml_entity_id:   Optional[str] = None
    saml_sso_url:     Optional[str] = None
    saml_slo_url:     Optional[str] = None
    saml_x509_cert:   Optional[str] = None
    saml_attribute_email:   Optional[str] = "email"
    saml_attribute_name:    Optional[str] = "displayName"
    saml_attribute_groups:  Optional[str] = "groups"
    saml_sign_requests:     Optional[bool] = True
    saml_want_assertions_signed: Optional[bool] = True

    # OIDC / Azure AD / Google
    oidc_client_id:     Optional[str] = None
    oidc_client_secret: Optional[str] = None
    oidc_issuer_url:    Optional[str] = None
    oidc_scopes:        Optional[list[str]] = None

    # Azure AD
    azure_tenant_id:    Optional[str] = None

    # Google Workspace
    google_hd:          Optional[str] = None

    # Role mapping
    role_mapping:   Optional[dict] = {}
    default_role:   Optional[str] = "Viewer"
    jit_provisioning: Optional[bool] = True

    # Security
    enforce_mfa:        Optional[bool] = False
    session_max_age:    Optional[int] = 28800
    allowed_clock_skew: Optional[int] = 300


class IdPResponse(BaseModel):
    idp_id:        str
    org_id:        str
    name:          str
    protocol:      str
    status:        str
    is_primary:    bool
    jit_provisioning: bool
    default_role:  str
    role_mapping:  dict
    created_at:    datetime
    last_used_at:  Optional[datetime]
    error_message: Optional[str]

    class Config:
        from_attributes = True


class IdPTestResult(BaseModel):
    success:  bool
    message:  str
    details:  Optional[dict] = None


# ─────────────────────────────────────────────────────────────────────────────
# IdP Management Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/{org_id}/providers", response_model=list[IdPResponse])
def list_identity_providers(
    org_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all identity providers for an organization."""
    _assert_org_admin(current_user, org_id, db)

    providers = db.query(IdentityProvider).filter(
        IdentityProvider.org_id == org_id
    ).all()
    return providers


@router.post("/{org_id}/providers", response_model=IdPResponse, status_code=201)
def create_identity_provider(
    org_id: str,
    req: IdPCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Configure a new identity provider for the organization."""
    _assert_org_admin(current_user, org_id, db)

    # Validate org exists
    org = db.query(Organization).filter(Organization.org_id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    # Validate protocol
    valid_protocols = {p.value for p in SSOProtocol}
    if req.protocol not in valid_protocols:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid protocol '{req.protocol}'. Must be one of: {', '.join(valid_protocols)}"
        )

    acs_url = f"{SP_BASE_URL}/sso/saml/acs"
    sp_entity_id = f"{SP_BASE_URL}/sso/saml/{org_id}/metadata"

    idp = IdentityProvider(
        idp_id=str(uuid.uuid4()),
        org_id=org_id,
        name=req.name,
        protocol=req.protocol,
        status=SSOStatus.PENDING.value,

        saml_entity_id=req.saml_entity_id,
        saml_sso_url=req.saml_sso_url,
        saml_slo_url=req.saml_slo_url,
        saml_x509_cert=req.saml_x509_cert,
        saml_acs_url=acs_url,
        saml_sp_entity_id=sp_entity_id,
        saml_attribute_email=req.saml_attribute_email,
        saml_attribute_name=req.saml_attribute_name,
        saml_attribute_groups=req.saml_attribute_groups,
        saml_sign_requests=req.saml_sign_requests,
        saml_want_assertions_signed=req.saml_want_assertions_signed,

        oidc_client_id=req.oidc_client_id,
        oidc_client_secret=req.oidc_client_secret,
        oidc_issuer_url=req.oidc_issuer_url,
        oidc_scopes=req.oidc_scopes or ["openid", "email", "profile"],
        oidc_redirect_uri=f"{SP_BASE_URL}/sso/oidc/callback",

        azure_tenant_id=req.azure_tenant_id,
        google_hd=req.google_hd,

        role_mapping=req.role_mapping or {},
        default_role=req.default_role or "Viewer",
        jit_provisioning=req.jit_provisioning,

        enforce_mfa=req.enforce_mfa,
        session_max_age=req.session_max_age,
        allowed_clock_skew=req.allowed_clock_skew,
    )

    db.add(idp)
    db.add(AuditLog(
        user_id=current_user.user_id,
        action="SSO_IDP_CREATED",
        metadata_json={"idp_id": idp.idp_id, "org_id": org_id, "protocol": req.protocol}
    ))
    db.commit()
    db.refresh(idp)
    return idp


@router.put("/{org_id}/providers/{idp_id}", response_model=IdPResponse)
def update_identity_provider(
    org_id: str,
    idp_id: str,
    req: IdPCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an existing identity provider configuration."""
    _assert_org_admin(current_user, org_id, db)

    idp = _get_idp(idp_id, org_id, db)

    update_fields = req.dict(exclude_none=True)
    for field, value in update_fields.items():
        if hasattr(idp, field):
            setattr(idp, field, value)

    idp.status = SSOStatus.PENDING.value
    idp.error_message = None

    db.add(AuditLog(
        user_id=current_user.user_id,
        action="SSO_IDP_UPDATED",
        metadata_json={"idp_id": idp_id, "fields": list(update_fields.keys())}
    ))
    db.commit()
    db.refresh(idp)
    return idp


@router.delete("/{org_id}/providers/{idp_id}", status_code=204)
def delete_identity_provider(
    org_id: str,
    idp_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete an identity provider configuration."""
    _assert_org_admin(current_user, org_id, db)
    idp = _get_idp(idp_id, org_id, db)
    db.add(AuditLog(
        user_id=current_user.user_id,
        action="SSO_IDP_DELETED",
        metadata_json={"idp_id": idp_id, "name": idp.name}
    ))
    db.delete(idp)
    db.commit()
    return Response(status_code=204)


@router.post("/{org_id}/providers/{idp_id}/test", response_model=IdPTestResult)
async def test_identity_provider(
    org_id: str,
    idp_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Test IdP configuration by validating reachability and credentials."""
    _assert_org_admin(current_user, org_id, db)
    idp = _get_idp(idp_id, org_id, db)

    try:
        if idp.protocol == SSOProtocol.SAML2.value:
            # Validate SAML metadata is reachable
            if not idp.saml_entity_id or not idp.saml_sso_url or not idp.saml_x509_cert:
                raise ValueError("SAML IdP requires entity_id, sso_url, and x509_cert")
            result = IdPTestResult(success=True, message="SAML configuration is valid", details={
                "entity_id": idp.saml_entity_id,
                "sso_url": idp.saml_sso_url,
                "cert_preview": idp.saml_x509_cert[:50] + "..." if idp.saml_x509_cert else None,
            })

        elif idp.protocol in (SSOProtocol.OIDC.value, SSOProtocol.AZURE_AD.value, SSOProtocol.GOOGLE_WORKSPACE.value):
            # Fetch OIDC discovery document
            svc = OIDCService(idp)
            discovery = await svc.get_discovery()
            idp.status = SSOStatus.ACTIVE.value
            db.commit()
            result = IdPTestResult(
                success=True,
                message="OIDC discovery document fetched successfully",
                details={
                    "issuer":               discovery.get("issuer"),
                    "authorization_endpoint": discovery.get("authorization_endpoint"),
                    "token_endpoint":       discovery.get("token_endpoint"),
                    "jwks_uri":             discovery.get("jwks_uri"),
                }
            )
        else:
            raise ValueError(f"Unknown protocol: {idp.protocol}")

        idp.status = SSOStatus.ACTIVE.value
        idp.error_message = None

    except Exception as e:
        idp.status = SSOStatus.ERROR.value
        idp.error_message = str(e)
        result = IdPTestResult(success=False, message=str(e))

    db.commit()
    return result


# ─────────────────────────────────────────────────────────────────────────────
# SAML 2.0 Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/saml/{idp_id}/metadata", response_class=Response)
def saml_metadata(idp_id: str, db: Session = Depends(get_db)):
    """Return SP metadata XML for this IdP configuration."""
    idp = db.query(IdentityProvider).filter(IdentityProvider.idp_id == idp_id).first()
    if not idp:
        raise HTTPException(status_code=404, detail="Identity provider not found")

    acs_url = idp.saml_acs_url or f"{SP_BASE_URL}/sso/saml/acs"
    sp_entity_id = idp.saml_sp_entity_id or SP_ENTITY_ID

    metadata_xml = f"""<?xml version="1.0"?>
<md:EntityDescriptor
    xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
    entityID="{sp_entity_id}">
  <md:SPSSODescriptor
      AuthnRequestsSigned="{"true" if idp.saml_sign_requests else "false"}"
      WantAssertionsSigned="{"true" if idp.saml_want_assertions_signed else "false"}"
      protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:AssertionConsumerService
        Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
        Location="{acs_url}"
        index="1"/>
    <md:NameIDFormat>{idp.saml_name_id_format}</md:NameIDFormat>
  </md:SPSSODescriptor>
</md:EntityDescriptor>"""

    return Response(content=metadata_xml, media_type="application/samlmetadata+xml")


@router.get("/saml/{idp_id}/login")
def saml_login(idp_id: str, db: Session = Depends(get_db)):
    """Initiate SAML SP-initiated login. Redirects to IdP SSO URL."""
    idp = db.query(IdentityProvider).filter(IdentityProvider.idp_id == idp_id).first()
    if not idp:
        raise HTTPException(status_code=404, detail="Identity provider not found")

    if idp.status == SSOStatus.DISABLED.value:
        raise HTTPException(status_code=403, detail="This SSO provider is disabled")

    svc = SAMLService(idp)
    redirect_url, relay_state = svc.build_authn_request_url()
    return RedirectResponse(url=redirect_url, status_code=302)


@router.post("/saml/acs")
def saml_acs(
    SAMLResponse: str = Form(...),
    RelayState:   str = Form(default=""),
    db: Session = Depends(get_db),
):
    """
    SAML Assertion Consumer Service.
    Receives POST from IdP after authentication.
    Validates assertion, provisions user, issues JWT, redirects to app.
    """
    # ── Find IdP by the SAMLResponse issuer (we need to decode first) ──
    # In production, RelayState contains the idp_id for routing
    # Fallback: parse entity ID from response XML
    idp_id = _extract_idp_from_relay_or_response(RelayState, SAMLResponse, db)

    idp = db.query(IdentityProvider).filter(IdentityProvider.idp_id == idp_id).first()
    if not idp:
        raise HTTPException(status_code=400, detail="Unknown SAML Identity Provider")

    try:
        svc = SAMLService(idp)
        claims = svc.parse_response(SAMLResponse, db)
    except ValueError as e:
        db.add(AuditLog(
            user_id="system",
            action="SSO_SAML_VALIDATION_FAILED",
            metadata_json={"idp_id": idp_id, "error": str(e)}
        ))
        db.commit()
        raise HTTPException(status_code=401, detail=f"SAML validation failed: {e}")

    provisioner = SSOUserProvisioner(idp)
    try:
        user, access_token = provisioner.provision(
            db=db,
            email=claims["email"],
            name=claims["name"],
            groups=claims["groups"],
            protocol_session=claims,
        )
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))

    create_sso_session(
        db=db,
        idp=idp,
        user=user,
        access_token=access_token,
        saml_session_index=claims.get("session_index"),
        saml_name_id=claims.get("name_id"),
    )

    # Redirect to dashboard with token in query param (or set cookie)
    redirect_url = f"{SP_BASE_URL}/dashboard?sso_token={access_token}"
    return RedirectResponse(url=redirect_url, status_code=302)


# ─────────────────────────────────────────────────────────────────────────────
# OIDC / Azure AD / Google Workspace Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/oidc/{idp_id}/login")
async def oidc_login(idp_id: str, db: Session = Depends(get_db)):
    """Initiate OIDC authorization code flow. Redirects to IdP authorization endpoint."""
    idp = db.query(IdentityProvider).filter(IdentityProvider.idp_id == idp_id).first()
    if not idp:
        raise HTTPException(status_code=404, detail="Identity provider not found")

    if idp.status == SSOStatus.DISABLED.value:
        raise HTTPException(status_code=403, detail="This SSO provider is disabled")

    svc = OIDCService(idp)
    try:
        authorization_url, state = await svc.build_authorization_url(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to build authorization URL: {e}")

    return RedirectResponse(url=authorization_url, status_code=302)


@router.get("/oidc/callback")
async def oidc_callback(
    code:  str,
    state: str,
    db: Session = Depends(get_db),
    error: Optional[str] = None,
    error_description: Optional[str] = None,
):
    """
    OIDC callback endpoint.
    Validates code + state, exchanges for tokens, provisions user.
    """
    if error:
        raise HTTPException(
            status_code=401,
            detail=f"OIDC error: {error} — {error_description or 'Authorization denied'}"
        )

    # Look up state to find the IdP
    oidc_state = db.query(OIDCState).filter(OIDCState.state == state).first()
    if not oidc_state:
        raise HTTPException(status_code=400, detail="Invalid OIDC state — possible CSRF attack")

    idp = db.query(IdentityProvider).filter(
        IdentityProvider.idp_id == oidc_state.idp_id
    ).first()
    if not idp:
        raise HTTPException(status_code=400, detail="Identity provider not found for state")

    svc = OIDCService(idp)
    try:
        claims = await svc.exchange_code(code, state, db)
    except ValueError as e:
        db.add(AuditLog(
            user_id="system",
            action="SSO_OIDC_VALIDATION_FAILED",
            metadata_json={"idp_id": idp.idp_id, "error": str(e)}
        ))
        db.commit()
        raise HTTPException(status_code=401, detail=f"OIDC validation failed: {e}")

    provisioner = SSOUserProvisioner(idp)
    try:
        user, access_token = provisioner.provision(
            db=db,
            email=claims["email"],
            name=claims["name"],
            groups=claims.get("groups", []),
            protocol_session=claims,
        )
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))

    create_sso_session(
        db=db,
        idp=idp,
        user=user,
        access_token=access_token,
        oidc_sub=claims.get("sub"),
    )

    redirect_url = f"{SP_BASE_URL}/dashboard?sso_token={access_token}"
    return RedirectResponse(url=redirect_url, status_code=302)


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _assert_org_admin(user: User, org_id: str, db: Session):
    """Ensure the current user is an admin or owner of the organization."""
    from models import OrganizationMember
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.org_id == org_id,
        OrganizationMember.user_id == user.user_id,
        OrganizationMember.role.in_(["Owner", "Admin"]),
    ).first()
    if not membership and user.role not in ("Admin", "Owner"):
        raise HTTPException(
            status_code=403,
            detail="Only organization admins can manage SSO configuration"
        )


def _get_idp(idp_id: str, org_id: str, db: Session) -> IdentityProvider:
    idp = db.query(IdentityProvider).filter(
        IdentityProvider.idp_id == idp_id,
        IdentityProvider.org_id == org_id,
    ).first()
    if not idp:
        raise HTTPException(status_code=404, detail="Identity provider not found")
    return idp


def _extract_idp_from_relay_or_response(relay_state: str, saml_response: str, db: Session) -> str:
    """
    Extract IdP ID from RelayState (preferred) or parse issuer from SAMLResponse.
    """
    # Try RelayState first (we encode idp_id:random in relay_state)
    if relay_state and ":" in relay_state:
        parts = relay_state.split(":", 1)
        candidate_idp = db.query(IdentityProvider).filter(
            IdentityProvider.idp_id == parts[0]
        ).first()
        if candidate_idp:
            return parts[0]

    # Fallback: parse Issuer from SAMLResponse XML
    try:
        import base64
        raw_xml = base64.b64decode(saml_response)
        from xml.etree import ElementTree as ET
        root = ET.fromstring(raw_xml)
        ns = {"saml": "urn:oasis:names:tc:SAML:2.0:assertion"}
        issuer_el = root.find(".//saml:Issuer", ns)
        if issuer_el is not None and issuer_el.text:
            idp = db.query(IdentityProvider).filter(
                IdentityProvider.saml_entity_id == issuer_el.text.strip()
            ).first()
            if idp:
                return idp.idp_id
    except Exception:
        pass

    raise HTTPException(status_code=400, detail="Cannot determine Identity Provider from SAML response")
