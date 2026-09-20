# Phase 14A — Loyalty & Membership Ecosystem

## Overview
The Loyalty & Membership Ecosystem manages tiered user statuses (Bronze, Silver, Gold, Platinum), automated cashback reward distribution, subscription perks, and referral incentives.

## Architecture & Data Model
- Model: `LoyaltyAccount` (userId, tier, points, cashbackBalance, referralCode)
- Service: `LoyaltyTierService`
- Controller: `LoyaltyController`

## API Endpoints
- `GET /loyalty/account/:userId`: Get user tier and balance.
- `POST /loyalty/cashback/calculate`: Calculate cashback earned per transaction.
