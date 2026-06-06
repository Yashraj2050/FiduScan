
import os
import stripe

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "sk_test_123")

class StripeService:
    @staticmethod
    def create_checkout_session(customer_id, price_id):
        return stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="subscription",
            success_url="https://fiduscan.com/success",
            cancel_url="https://fiduscan.com/cancel",
        )

    @staticmethod
    def create_billing_portal_session(customer_id):
        return stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url="https://fiduscan.com/settings/billing"
        )

    @staticmethod
    def construct_webhook_event(payload, sig_header, secret):
        return stripe.Webhook.construct_event(payload, sig_header, secret)
