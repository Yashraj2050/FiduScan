
import os
import logging

STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")

# Configure stripe only when the key is available.
# Optional integrations must not crash the application at import time.
if STRIPE_SECRET_KEY:
    try:
        import stripe as _stripe
        _stripe.api_key = STRIPE_SECRET_KEY
    except ImportError:
        _stripe = None
        logging.warning("stripe package not installed; billing features disabled.")
else:
    _stripe = None
    logging.warning(
        "STRIPE_SECRET_KEY not set. Stripe billing features will be unavailable "
        "until the key is configured."
    )


def _require_stripe():
    """Raise a clear error at call-time if Stripe is not configured."""
    if _stripe is None:
        raise RuntimeError(
            "Stripe is not configured. Set STRIPE_SECRET_KEY to enable billing."
        )
    return _stripe


class StripeService:
    @staticmethod
    def create_customer(email, name):
        stripe = _require_stripe()
        return stripe.Customer.create(email=email, name=name)

    @staticmethod
    def create_checkout_session(customer_id, price_id):
        stripe = _require_stripe()
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
        stripe = _require_stripe()
        return stripe.Webhook.construct_event(payload, sig_header, secret)

    @staticmethod
    def update_quota(customer_id, plan_type):
        # Update user quotas based on subscription
        pass

    @staticmethod
    def generate_invoice_record(invoice_data):
        # Store invoice in DB
        pass
