"""
File validation utilities — enforces strict upload security.
"""
import imghdr
import io
from fastapi import HTTPException
from utils.logger import setup_logger

logger = setup_logger("fiduscan.file_validator")

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
ALLOWED_MIME_SIGNATURES = {
    b"\xff\xd8\xff": "JPEG",
    b"\x89PNG": "PNG",
    b"RIFF": "WEBP",   # WEBP starts with RIFF....WEBP
    b"BM": "BMP",
}
MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB


def validate_image_upload(filename: str, image_bytes: bytes) -> None:
    """
    Validates an uploaded file for:
    - File size limits
    - Extension whitelist
    - Magic byte signature verification
    - Executable/script content rejection

    Raises HTTPException (400) on any violation.
    """
    # ── Size check ────────────────────────────────────────────────────────────
    if len(image_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum allowed: {MAX_FILE_SIZE_BYTES // (1024*1024)}MB.",
        )

    if len(image_bytes) < 8:
        raise HTTPException(status_code=400, detail="File is too small or empty.")

    # ── Extension check ───────────────────────────────────────────────────────
    if filename:
        from pathlib import Path
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"File extension '{ext}' not allowed. Accepted: {ALLOWED_EXTENSIONS}",
            )

    # ── Magic byte check ──────────────────────────────────────────────────────
    header = image_bytes[:8]
    matched = False
    for sig, fmt in ALLOWED_MIME_SIGNATURES.items():
        if header[: len(sig)] == sig:
            matched = True
            logger.debug(f"File signature matched: {fmt}")
            break

    if not matched:
        raise HTTPException(
            status_code=400,
            detail="File content does not match a valid image format. Upload rejected.",
        )

    # ── Executable/script injection guard ─────────────────────────────────────
    dangerous_patterns = [b"#!/", b"<?php", b"<script", b"\x4d\x5a"]  # MZ = PE exe
    for pattern in dangerous_patterns:
        if pattern in image_bytes[:512]:
            logger.warning(
                f"🚨 SECURITY: Dangerous content pattern '{pattern}' detected in upload."
            )
            raise HTTPException(
                status_code=400,
                detail="Uploaded file contains disallowed content patterns.",
            )

    logger.info(f"✅ File validation passed: {filename} ({len(image_bytes)} bytes)")
