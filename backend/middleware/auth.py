"""
Authentication-ready middleware.
Phase 1: Passthrough (no auth enforced).
Phase 2: Replace with JWT Bearer token verification.

To enable JWT auth in Phase 2:
    pip install python-jose[cryptography] passlib[bcrypt]
    Set API_SECRET_KEY in environment.
    Uncomment verify_token() below and apply @router.dependencies.
"""
import os
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Phase 2: JWT secret key
API_SECRET_KEY = os.environ.get("API_SECRET_KEY", "CHANGE_ME_IN_PRODUCTION")

security = HTTPBearer(auto_error=False)


async def optional_auth(
    credentials: HTTPAuthorizationCredentials = Security(security),
) -> dict | None:
    """
    Phase 1: Returns None (no auth enforced).
    Phase 2: Decode and validate Bearer JWT.
    """
    # Phase 2 implementation placeholder:
    # if credentials is None:
    #     raise HTTPException(status_code=401, detail="Missing authentication token")
    # token = credentials.credentials
    # payload = verify_token(token)  # raises 401 if invalid
    # return payload
    return None  # Passthrough for Phase 1
