
import os
import stripe
import logging

# 1. & 2. Require keys at startup, remove fallbacks
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")
if not STRIPE_SECRET_KEY:
    raise RuntimeError("STRIPE_SECRET_KEY is required for production.")
stripe.api_key = STRIPE_SECRET_KEY

class StripeService:
    @staticmethod
    def create_customer(email, name):
        return stripe.Customer.create(email=email, name=name)

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
    def construct_webhook_event(payload, sig_header, secret):
        return stripe.Webhook.construct_event(payload, sig_header, secret)
        
    @staticmethod
    def update_quota(customer_id, plan_type):
        # Update user quotas based on subscription
        pass
        
    @staticmethod
    def generate_invoice_record(invoice_data):
        # Store invoice in DB
        pass
