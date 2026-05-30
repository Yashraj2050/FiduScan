"""
Metadata Service — extracts EXIF and image metadata from uploaded files.
"""
import io
import struct
from typing import Optional
from PIL import Image, ExifTags
from utils.logger import setup_logger

logger = setup_logger("fiduscan.metadata_service")


def extract_metadata(image_bytes: bytes, filename: str) -> dict:
    """
    Extract comprehensive image metadata including EXIF data.

    Args:
        image_bytes: Raw image file bytes.
        filename: Original filename.

    Returns:
        Dictionary of metadata fields.
    """
    meta = {
        "filename": filename,
        "file_size_bytes": len(image_bytes),
    }

    try:
        img = Image.open(io.BytesIO(image_bytes))
        meta["format"] = img.format or "Unknown"
        meta["mode"] = img.mode
        meta["width"] = img.width
        meta["height"] = img.height
        meta["megapixels"] = round((img.width * img.height) / 1_000_000, 2)

        # EXIF extraction
        exif_data = img._getexif()  # type: ignore
        if exif_data:
            exif_clean = {}
            for tag_id, value in exif_data.items():
                tag_name = ExifTags.TAGS.get(tag_id, str(tag_id))
                # Skip binary blobs (thumbnails etc.)
                if isinstance(value, bytes):
                    exif_clean[tag_name] = f"<binary {len(value)} bytes>"
                else:
                    try:
                        exif_clean[tag_name] = str(value)
                    except Exception:
                        exif_clean[tag_name] = "<unreadable>"
            meta["exif"] = exif_clean

            # Flag GPS data presence (privacy indicator)
            meta["has_gps"] = "GPSInfo" in exif_clean
            # Detect software tag (can reveal AI tools)
            meta["software"] = exif_clean.get("Software", None)
            meta["camera_make"] = exif_clean.get("Make", None)
            meta["camera_model"] = exif_clean.get("Model", None)
            meta["date_time"] = exif_clean.get("DateTime", None)
        else:
            meta["exif"] = {}
            meta["has_gps"] = False
            meta["software"] = None
            meta["camera_make"] = None
            meta["camera_model"] = None
            meta["date_time"] = None

        # Forensic flags
        meta["forensic_flags"] = _compute_forensic_flags(meta)

    except Exception as exc:
        logger.warning(f"Metadata extraction error for {filename}: {exc}")
        meta["error"] = str(exc)

    return meta


def _compute_forensic_flags(meta: dict) -> list[str]:
    """
    Generate a list of forensic indicator flags from metadata.
    These are heuristic signals, not definitive detections.
    """
    flags = []

    # AI generation tools often strip or lack EXIF entirely
    if not meta.get("exif"):
        flags.append("NO_EXIF — common in AI-generated images")

    # Check for known AI tool signatures in Software tag
    ai_software_keywords = ["stable diffusion", "midjourney", "dalle", "firefly", "flux", "comfy"]
    software = (meta.get("software") or "").lower()
    if any(kw in software for kw in ai_software_keywords):
        flags.append(f"AI_SOFTWARE_DETECTED — Software tag: {meta['software']}")

    # Suspiciously round dimensions common in AI outputs
    w, h = meta.get("width", 0), meta.get("height", 0)
    round_dims = [512, 768, 1024, 1536, 2048]
    if w in round_dims and h in round_dims:
        flags.append(f"ROUND_DIMENSIONS — {w}x{h} is a common AI output resolution")

    return flags
