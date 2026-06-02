import os
import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import get_db
from auth import get_current_user
from models import User, Subscription, BillingEvent, UsageTracking
from services.limits import get_plan_limits

# Configure Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_placeholder")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_placeholder")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

router = APIRouter()

class CheckoutRequest(BaseModel):
    plan: str # "pro" or "enterprise"

class PortalRequest(BaseModel):
    return_url: Optional[str] = None

@router.post("/create-checkout-session")
def create_checkout_session(
    request_data: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Check if user already has a subscription active
        existing_sub = db.query(Subscription).filter(Subscription.user_id == current_user.user_id).first()
        
        customer_id = existing_sub.stripe_customer_id if existing_sub else None

        # Hardcoded price IDs for test mode. 
        # Ideally, map "pro" to a real price ID in your Stripe test dashboard.
        # Since I don't know the Price ID, we create one dynamically or use a dummy if not possible.
        # However, to actually checkout, Stripe needs a valid price ID.
        # Let's create a temporary product/price just in case, or use a dummy.
        # Actually, for demonstration, let's create a dynamic price if it doesn't exist, 
        # but normally you configure this in Stripe Dashboard.
        
        # NOTE: In test mode, we'll just create a dummy product/price if we need to.
        # But for an MVP, we just need a valid string or we can create it on the fly.
        product = stripe.Product.create(name=f"FiduScan {request_data.plan.capitalize()} Plan")
        price = stripe.Price.create(
            product=product.id,
            unit_amount=4900 if request_data.plan == "pro" else 19900,
            currency="usd",
            recurring={"interval": "month"}
        )
        
        session_params = {
            "payment_method_types": ["card"],
            "line_items": [{
                "price": price.id,
                "quantity": 1,
            }],
            "mode": "subscription",
            "success_url": f"{FRONTEND_URL}/?session_id={{CHECKOUT_SESSION_ID}}",
            "cancel_url": f"{FRONTEND_URL}/",
            "client_reference_id": current_user.user_id,
        }
        
        if customer_id:
            session_params["customer"] = customer_id
        else:
            session_params["customer_email"] = current_user.email

        checkout_session = stripe.checkout.Session.create(**session_params)
        return {"url": checkout_session.url}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/create-portal-session")
def create_portal_session(
    request_data: PortalRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        sub = db.query(Subscription).filter(Subscription.user_id == current_user.user_id).first()
        if not sub or not sub.stripe_customer_id:
            raise HTTPException(status_code=400, detail="No active subscription found.")

        portal_session = stripe.billing_portal.Session.create(
            customer=sub.stripe_customer_id,
            return_url=request_data.return_url or f"{FRONTEND_URL}/"
        )
        return {"url": portal_session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        if STRIPE_WEBHOOK_SECRET != "whsec_placeholder":
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        else:
            # Bypass validation for local dev without a secret
            import json
            data = json.loads(payload)
            event = stripe.Event.construct_from(data, stripe.api_key)
            
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Save subscription to DB
        user_id = session.get('client_reference_id')
        if user_id:
            # Assuming we got user_id
            sub = db.query(Subscription).filter(Subscription.user_id == user_id).first()
            if not sub:
                import datetime
                # Fetch subscription from Stripe to get period end
                stripe_sub = stripe.Subscription.retrieve(session['subscription'])
                new_sub = Subscription(
                    id=f"sub_{user_id}",
                    user_id=user_id,
                    stripe_customer_id=session['customer'],
                    stripe_subscription_id=session['subscription'],
                    plan="pro", # Simplify for MVP
                    status=stripe_sub['status'],
                    current_period_end=datetime.datetime.fromtimestamp(stripe_sub['current_period_end'])
                )
                db.add(new_sub)
                db.commit()

    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        sub_id = subscription['id']
        sub = db.query(Subscription).filter(Subscription.stripe_subscription_id == sub_id).first()
        if sub:
            import datetime
            sub.status = subscription['status']
            sub.current_period_end = datetime.datetime.fromtimestamp(subscription['current_period_end'])
            db.commit()

    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        sub_id = subscription['id']
        sub = db.query(Subscription).filter(Subscription.stripe_subscription_id == sub_id).first()
        if sub:
            sub.status = 'canceled'
            db.commit()

    # Log event
    db_event = BillingEvent(
        id=event['id'],
        event_type=event['type'],
        payload=event['data']['object']
    )
    db.add(db_event)
    try:
        db.commit()
    except Exception:
        db.rollback() # Event probably already recorded

    return {"status": "success"}

@router.get('/subscription')
def get_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sub = db.query(Subscription).filter(Subscription.user_id == current_user.user_id).first()
    if sub:
        return {
            "status": sub.status,
            "plan": sub.plan,
            "current_period_end": sub.current_period_end.isoformat()
        }
    return {"status": "free", "plan": "free", "current_period_end": None}
@router.get('/usage')
def get_usage(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sub = db.query(Subscription).filter(Subscription.user_id == current_user.user_id).first()
    plan = sub.plan if (sub and sub.status == 'active') else 'free'
    
    limits = get_plan_limits(plan)
    
    usage = db.query(UsageTracking).filter(UsageTracking.user_id == current_user.user_id).first()
    
    image_scans = usage.image_scans if usage else 0
    audio_scans = usage.audio_scans if usage else 0
    video_scans = usage.video_scans if usage else 0
    api_calls = usage.api_calls if usage else 0
    
    return {
        "current_plan": plan,
        "usage_limits": limits,
        "remaining_quota": {
            "image": max(0, limits.get("image", 0) - image_scans),
            "audio": max(0, limits.get("audio", 0) - audio_scans),
            "video": max(0, limits.get("video", 0) - video_scans),
            "api_calls": max(0, limits.get("api_calls", 0) - api_calls)
        },
        "image_scans": image_scans,
        "audio_scans": audio_scans,
        "video_scans": video_scans,
        "api_calls": api_calls,
        "storage_used": usage.storage_used if usage else 0
    }
