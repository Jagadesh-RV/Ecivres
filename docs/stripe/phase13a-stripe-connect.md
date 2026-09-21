# Phase 13A — Stripe Connect Marketplace Payments

## Overview
Replaces simulated payout flows with Stripe Connect Express for automated provider onboarding, destination charges, platform fee splits, and webhook verification.

## APIs
- `POST /stripe-connect/onboarding-link`: Express account onboarding link generator.
- `GET /stripe-connect/account-status/:providerId`: Status & payout eligibility check.
- `POST /stripe-connect/webhooks/payout`: Payout & account status listener.
