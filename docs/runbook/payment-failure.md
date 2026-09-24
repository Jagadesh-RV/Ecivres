# Operational Runbook — Stripe Payment Gateway Mitigation

## Symptoms
- Webhook signature failure alerts or surge in payment decline errors.

## Mitigation Steps
1. Verify Stripe API service status page.
2. Fallback to secondary payment processor (Razorpay / PayPal) if Stripe has regional outage.
