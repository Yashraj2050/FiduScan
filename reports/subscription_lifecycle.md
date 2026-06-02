# Stripe Subscription Lifecycle

## Overview
This document outlines the tested subscription lifecycle for FiduScan users using Stripe Test Mode.

## 1. Upgrade Initialization
- User clicks "Upgrade to Enterprise" on the Settings Hub.
- Frontend calls `/api/v1/billing/create-checkout-session`.
- Backend creates a Stripe Checkout Session linked to the user's ID (`client_reference_id`).
- User is redirected to the Stripe hosted checkout page.

## 2. Active Subscription
- User completes checkout using a Stripe test card (e.g. `4242`).
- Stripe fires `checkout.session.completed` to `/api/v1/billing/webhook`.
- Backend intercepts the payload, verifies the Stripe signature, and extracts `customer` and `subscription` IDs.
- A new record is created in the `subscriptions` table mapping `user_id` to `stripe_customer_id` and setting `status = 'active'`.

## 3. Subscription Management
- User clicks "Manage Subscription" on the Settings Hub.
- Frontend calls `/api/v1/billing/create-portal-session`.
- Backend uses the existing `stripe_customer_id` to generate a secure Stripe Customer Portal URL.
- User is redirected to the portal to update payment methods or view invoices.

## 4. Cancellation & Expiration
- If the user cancels via the Customer Portal, Stripe fires `customer.subscription.updated` (with `cancel_at_period_end = true`) or `customer.subscription.deleted`.
- Backend updates the `subscriptions` table `status` to `canceled`.
- Future API requests referencing this `user_id` will fall back to free-tier usage limits.
