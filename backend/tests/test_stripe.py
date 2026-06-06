
import unittest
from services.stripe_service import StripeService

class TestStripeBilling(unittest.TestCase):
    def test_webhook_signature(self):
        # We test that invalid signatures throw an error
        with self.assertRaises(Exception):
            StripeService.construct_webhook_event(b"payload", "invalid_sig", "secret")
