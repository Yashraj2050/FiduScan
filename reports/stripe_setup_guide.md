# Stripe Local Testing Setup Guide

## Step 1: Export API Keys
Export your Publishable and Secret keys in your terminal before launching the backend/frontend.
```bash
export STRIPE_PUBLISHABLE_KEY=pk_test_...
export STRIPE_SECRET_KEY=sk_test_...
```

## Step 2: Set up Webhooks Locally
To test webhooks (like subscription updates), you need to forward Stripe events to your local machine using the Stripe CLI.

1. Install Stripe CLI (e.g. `brew install stripe/stripe-cli/stripe`)
2. Login: `stripe login`
3. Forward events to FastAPI:
```bash
stripe listen --forward-to localhost:8000/api/v1/billing/webhook
```

## Step 3: Configure Webhook Secret
When you run `stripe listen`, it will output a webhook signing secret (e.g. `whsec_...`).
Export this secret in the same terminal running your backend:
```bash
export STRIPE_WEBHOOK_SECRET=whsec_...
```

The backend is configured to securely verify webhook signatures using this secret, providing production-grade security mirroring for your test environment.
