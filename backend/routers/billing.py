
from fastapi import APIRouter, Request, HTTPException, Header
from services.stripe_service import StripeService
import os
import logging

router = APIRouter()
WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "whsec_123")

@router.post("/create-checkout-session")
def create_checkout_session(customer_id: str, price_id: str):
    session = StripeService.create_checkout_session(customer_id, price_id)
    return {"url": session.url}

@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()
    try:
        event = StripeService.construct_webhook_event(payload, stripe_signature, WEBHOOK_SECRET)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Handle events
    if event["type"] == "checkout.session.completed":
        logging.info("Payment successful.")
    elif event["type"] == "customer.subscription.deleted":
        logging.info("Subscription canceled.")
        
    return {"status": "success"}
