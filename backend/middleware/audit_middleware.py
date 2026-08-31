import json
import logging
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal
from models import AuditLog, User
from auth import SECRET_KEY, ALGORITHM
from jose import jwt

logger = logging.getLogger("fiduscan.audit_middleware")

class AuditLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # We only log state-mutating methods
        if request.method not in ["POST", "PUT", "DELETE", "PATCH"]:
            return await call_next(request)
            
        # Don't log login/register here since they log themselves, or we can just let it log generically
        if request.url.path in ["/api/v1/auth/login", "/api/v1/auth/register"]:
            return await call_next(request)

        # Attempt to get user_id from token
        user_id = None
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                if payload and "sub" in payload:
                    user_id = payload["sub"]
            except Exception:
                pass
                
        # To avoid foreign key violation on users.user_id if user_id is missing/invalid,
        # we check if the user actually exists, or we skip logging if no user is found.
        # System Audit Logging usually logs the action and the IP if unauthenticated, 
        # but our AuditLog model has nullable=False for user_id. 
        # Let's log it if we have a valid user_id.
        
        db: Session = SessionLocal()
        try:
            # We process the request first to capture the status code
            response = await call_next(request)
            
            if user_id:
                user = db.query(User).filter(User.user_id == user_id).first()
                if user:
                    action = f"{request.method} {request.url.path}"
                    metadata = {
                        "ip": request.client.host if request.client else None,
                        "user_agent": request.headers.get("user-agent"),
                        "status_code": response.status_code
                    }
                    log_entry = AuditLog(
                        user_id=user.user_id,
                        action=action,
                        metadata_json=metadata
                    )
                    db.add(log_entry)
                    db.commit()
            return response
        except Exception as e:
            # Log the failure if authenticated
            if user_id:
                user = db.query(User).filter(User.user_id == user_id).first()
                if user:
                    action = f"FAILED {request.method} {request.url.path}"
                    metadata = {
                        "ip": request.client.host if request.client else None,
                        "user_agent": request.headers.get("user-agent"),
                        "error": str(e)
                    }
                    log_entry = AuditLog(
                        user_id=user.user_id,
                        action=action,
                        metadata_json=metadata
                    )
                    db.add(log_entry)
                    db.commit()
            raise
        finally:
            db.close()
