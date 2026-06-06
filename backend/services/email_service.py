
import os
import logging
import resend

RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
if not RESEND_API_KEY:
    raise RuntimeError("RESEND_API_KEY is required for production.")

resend.api_key = RESEND_API_KEY

class EmailService:
    @staticmethod
    def send_email(to_email, subject, html_content):
        logging.info(f"Sending email via Resend to {to_email}: {subject}")
        params = {
            "from": "Acme <onboarding@resend.dev>",
            "to": [to_email],
            "subject": subject,
            "html": html_content,
        }
        email = resend.Emails.send(params)
        
        # Log to persistence layer
        # EmailLogService.log(to_email, subject, email["id"])
        
        return email
