# Billing Integration Architecture

## Frontend
- The Billing Dashboard uses `@stripe/stripe-js` to communicate securely with Stripe endpoints without exposing sensitive data.
- User upgrade interactions hit the `/api/v1/billing/create-checkout-session` endpoint to securely receive a checkout URL, handling redirect locally.
- Management interactions (update card, view invoices) hit the `/api/v1/billing/create-portal-session` endpoint to securely generate a Stripe Customer Portal link.

## Backend
- Webhook (`/api/v1/billing/webhook`) listens for `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`.
- Webhooks update the local `subscriptions` table and log interactions to `billing_events`.
- Secure creation of ad-hoc products/prices for testing purposes.
