
import os
import logging

RESEND_API_KEY = os.environ.get("RESEND_API_KEY")

# Configure resend only when the key is available.
# Optional integrations must not crash the application at import time.
if RESEND_API_KEY:
    try:
        import resend as _resend
        _resend.api_key = RESEND_API_KEY
    except ImportError:
        _resend = None
        logging.warning("resend package not installed; email features disabled.")
else:
    _resend = None
    logging.warning(
        "RESEND_API_KEY not set. Email features will be unavailable until the key is configured."
    )


def _require_resend():
    """Raise a clear error at call-time if Resend is not configured."""
    if _resend is None:
        raise RuntimeError(
            "Email service is not configured. Set RESEND_API_KEY to enable email sending."
        )
    return _resend


class EmailService:
    @staticmethod
    def send_email(to_email: str, subject: str, html_content: str):
        resend = _require_resend()
        logging.info(f"Sending email via Resend to {to_email}: {subject}")
        params = {
            "from": "FiduScan <onboarding@resend.dev>",
            "to": [to_email],
            "subject": subject,
            "html": html_content,
        }
        email = resend.Emails.send(params)
        return email
