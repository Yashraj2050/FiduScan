# FiduScan — Stripe Production Go-Live Checklist

**Version:** v9.0-timesformer-video  
**Last Updated:** 2026-06-11

---

## 1. Audit Summary

The Stripe integration is currently in a **partially implemented** state. While the foundational backend structure (lazy initialization, basic checkout creation, webhook signature validation) is present, the integration lacks crucial components necessary for production readiness, specifically regarding the Customer Billing Portal and database persistence.

**Status:** NOT READY FOR PRODUCTION

---

## 2. Feature Verification

### Checkout Flow
- [x] Backend: `create_checkout_session` endpoint exists.
- [ ] Frontend: `billing/page.tsx` buttons are static and not wired to the backend checkout endpoint.
- [ ] Product Configuration: Missing `STRIPE_PRICE_ID_PRO` environment mapping.

### Subscriptions & Webhooks
- [x] Webhook endpoint `/webhook` implemented.
- [x] Signature validation implemented.
- [x] Events handled: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`.
- [ ] Database Persistence: Handlers contain `TODO` comments. `update_quota` and `generate_invoice_record` do not actually update the database.

### Billing Portal (Upgrades, Downgrades, Cancellations)
- [ ] Backend: `stripe.billing_portal.Session.create` is entirely **missing**.
- [ ] Frontend: "Update Card" and cancellation flows have no corresponding API endpoints to hit.
- [ ] Flow: Users cannot currently self-serve cancellations, upgrades, or downgrades.

---

## 3. Required Environment Variables

To go live, the following variables must be configured in Railway:

1. `STRIPE_SECRET_KEY`: Production secret key (`sk_live_...`).
2. `STRIPE_WEBHOOK_SECRET`: Production webhook signing secret (`whsec_...`).
3. `STRIPE_PRICE_ID_PRO`: The ID of the Pro subscription price (`price_...`).
4. `STRIPE_PUBLISHABLE_KEY`: (Frontend) Required if integrating Stripe Elements, though Checkout can rely purely on backend redirects.

---

## 4. Action Plan for Completion

1. **Implement Billing Portal:** Add a backend endpoint to generate a Customer Portal Session and redirect the user. This solves upgrades, downgrades, cancellations, and payment method updates automatically.
2. **Implement DB Webhooks:** Replace the `TODO` comments in `StripeService.update_quota` with actual database calls to the `User` or `Subscription` models.
3. **Wire Frontend:** Connect the `[ Upgrade to Pro ]` and `[ Manage Billing ]` buttons in the React frontend to the respective backend endpoints.
4. **Provision Keys:** Generate restricted live keys in the Stripe Dashboard.
