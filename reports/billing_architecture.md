# Phase 5C — Billing Architecture
*Generated: 2026-05-31 01:40 IST*

## Monetization Integration Plan
Although payment processing is deferred, the architecture is designed to support Stripe as the primary billing provider.

### Architecture Components
1. **Payment Gateway:** Stripe Checkout for subscription lifecycle management.
2. **Subscription State:** Cloud SQL `users` table extended with:
   - `stripe_customer_id`
   - `subscription_status` (active, past_due, canceled)
   - `subscription_tier` (free, pro, enterprise)
3. **Usage Tracking:** Stripe Metered Billing (Usage-Based Billing) will be utilized for Enterprise API customers. A daily cron job will sync aggregated scan counts from the FiduScan database to Stripe.

### Webhook Handling
- A dedicated webhook endpoint (`POST /api/v1/webhooks/stripe`) will listen for events like `invoice.paid` and `customer.subscription.deleted` to instantly update the user's tier in the FiduScan database.

**Status: BILLING ARCHITECTURE DEFINED**
