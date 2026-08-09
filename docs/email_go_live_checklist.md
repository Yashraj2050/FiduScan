# FiduScan — Email Production Go-Live Checklist

**Version:** v9.0-timesformer-video  
**Last Updated:** 2026-06-11

---

## 1. Audit Summary

The email infrastructure is currently in a **barebones** state. While a base `EmailService` using Resend exists, it is completely unused in the application code. Furthermore, critical authentication emails (managed by Supabase) are not configured to use the custom domain.

**Status:** NOT READY FOR PRODUCTION

---

## 2. Feature Verification

### Resend Integration
- [x] Backend integration (`EmailService`) exists and lazily loads `resend`.
- [ ] Environment variables (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`) are missing from the production Railway/Vercel environments.

### Domain & DNS Configuration (Resend Dashboard)
- [ ] **Domain Configuration:** The production domain (e.g., `fiduscan.com`) is not fully verified in Resend.
- [ ] **SPF (Sender Policy Framework):** Missing DNS TXT record.
- [ ] **DKIM (DomainKeys Identified Mail):** Missing DNS TXT record.
- [ ] **DMARC (Domain-based Message Authentication):** Missing DNS TXT record (required by Gmail/Yahoo starting 2024).

### Transactional & Auth Emails
- [ ] **Password Reset Emails:** Missing. Supabase Auth handles this, but it currently uses the default Supabase SMTP server, which has strict rate limits and generic sender domains. Needs to be configured in Supabase Dashboard -> Auth -> SMTP to use Resend.
- [ ] **Verification Emails:** Missing. Also relies on Supabase Auth SMTP configuration.
- [ ] **Billing Emails:** Missing. Stripe sends standard receipts, but custom platform alerts (e.g., "Subscription Downgraded") are not wired up to the `EmailService`.

---

## 3. Action Plan for Completion

1. **Verify Domain in Resend:** Add the domain in the Resend dashboard and copy the generated DNS records.
2. **Update DNS Records:** Add the SPF, DKIM, and DMARC TXT/CNAME records to your DNS provider (e.g., Vercel, Cloudflare, Route53).
3. **Configure Supabase SMTP:** Go to the Supabase Dashboard > Authentication > SMTP Settings. Enable Custom SMTP and enter Resend's SMTP credentials (`smtp.resend.com`, port 465). This wires up Password Resets and User Verification.
4. **Implement Custom Alerts:** Use `EmailService.send_email()` in `backend/routers/billing.py` to notify users of important billing events.
5. **Set Environment Variables:** Add `RESEND_API_KEY` to the Railway backend.
