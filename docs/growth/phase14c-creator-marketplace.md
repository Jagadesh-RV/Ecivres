# Phase 14C — Creator & Influencer Affiliate Marketplace

## Overview
Empowers digital creators and influencers to monetize home service recommendations via trackable promo codes and custom referral links.

## Key Features
1. **Creator Profiles**: Auto-generated promo codes (`PROMO_HANDLE`) with configurable commission rates (default 8.0%).
2. **Commission Engine**: Real-time percentage payout calculation per converted booking.
3. **Campaign Analytics**: Track click counts, conversion rates, and gross merchandise value (GMV).

## APIs
- `POST /creator/profile`: Create affiliate creator profile.
- `POST /creator/calculate-commission`: Compute commission payout.
- `POST /creator/campaign`: Launch influencer campaign.
