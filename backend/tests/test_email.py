
import unittest
from services.email_service import EmailService
from templates.email_templates import EmailTemplates

class TestEmailService(unittest.TestCase):
    def test_send_email(self):
        res = EmailService.send_email("test@example.com", "Subject", "Body")
        self.assertEqual(res["status"], "sent")
        
    def test_templates(self):
        html = EmailTemplates.verification_email("12345")
        self.assertIn("12345", html)
