# Phase 14B — Loyalty & Rewards 2.0 Engine

## VIP Tiers & Cashback Rates
- **BRONZE**: Default tier, 2.0% cashback.
- **GOLD**: Total spend >= $500 USD or 5 bookings, 5.0% cashback + $20 Birthday Coupon.
- **PLATINUM**: Total spend >= $2,000 USD or 20 bookings, 7.5% cashback + $30 Birthday Coupon.
- **DIAMOND**: Total spend >= $5,000 USD or 50 bookings, 10.0% cashback + $50 Birthday Coupon.

## Surprise Rewards
- Automatically triggered on every 10th milestone booking ($25 USD instant credit bonus).

## APIs
- `POST /loyalty/calculate-tier`: Compute VIP tier status.
- `POST /loyalty/birthday-reward`: Evaluate birthday reward coupon.
- `POST /loyalty/surprise-reward`: Evaluate milestone surprise reward.
