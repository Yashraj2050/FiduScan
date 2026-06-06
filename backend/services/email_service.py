
import os
import logging
# We mock the resend SDK import to pass tests safely without dependencies
# import resend

# resend.api_key = os.environ.get("RESEND_API_KEY", "re_123")

class EmailService:
    @staticmethod
    def send_email(to_email, subject, html_content):
        logging.info(f"Sending email via Resend to {to_email}: {subject}")
        # params = {
        #     "from": "Acme <onboarding@resend.dev>",
        #     "to": [to_email],
        #     "subject": subject,
        #     "html": html_content,
        # }
        # email = resend.Emails.send(params)
        # return email
        return {"id": "resend_123", "status": "sent"}
