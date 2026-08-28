
from fastapi import APIRouter, Request, HTTPException, Header
from services.stripe_service import StripeService
import os
import logging

router = APIRouter()

# WEBHOOK_SECRET is read from the environment at import time but is NOT
# required to be present merely to import this module.  The endpoint itself
# validates that the secret is configured before processing any webhook.
WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")

if not WEBHOOK_SECRET:
    logging.warning(
        "STRIPE_WEBHOOK_SECRET not set. The /billing/webhook endpoint will "
        "return 503 until the secret is configured."
    )


@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    if not WEBHOOK_SECRET:
        raise HTTPException(
            status_code=503,
            detail=(
                "Stripe webhook is not configured on this server. "
                "Set STRIPE_WEBHOOK_SECRET to enable billing webhooks."
            ),
        )

    payload = await request.body()
    try:
        event = StripeService.construct_webhook_event(payload, stripe_signature, WEBHOOK_SECRET)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if event["type"] == "checkout.session.completed":
        logging.info("Payment successful.")
        customer_id = event["data"]["object"]["customer"]
        StripeService.update_quota(customer_id, "PRO")
    elif event["type"] == "invoice.paid":
        logging.info("Invoice paid.")
        StripeService.generate_invoice_record(event["data"]["object"])
    elif event["type"] == "customer.subscription.deleted":
        logging.info("Subscription canceled.")
        customer_id = event["data"]["object"]["customer"]
        StripeService.update_quota(customer_id, "FREE")

    return {"status": "success"}
