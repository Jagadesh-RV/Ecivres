# Phase 14G — Marketplace Reputation & Trust Framework

## Trust Scoring Engine
- **Base Score**: 50 Points.
- **Identity Verification**: +20 Points.
- **Customer Ratings**: Up to +20 Points (scaled by 5.0 rating).
- **Job Completion Volume**: Up to +10 Points.
- **Cancellation Penalty**: -2 Points per 1% cancellation rate.

## Verified Badges
- `BACKGROUND_VERIFIED`: Passed criminal & identity check.
- `INSURED_PROVIDER`: General liability insurance verified.
- `TOP_RATED_ELITE`: Trust Score >= 90.

## APIs
- `POST /reputation/trust-score`: Compute trust score.
- `POST /reputation/badges`: Evaluate verified badges.
