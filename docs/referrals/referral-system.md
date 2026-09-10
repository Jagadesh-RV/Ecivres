# EcivreS Referral Program Architecture

## Overview
The EcivreS Referral Ecosystem incentivizes organic customer acquisition and provider network expansion by rewarding both referrers and new signups with $15 in marketplace booking credits upon successful first service completion.

## Architecture & Lifecycle

### 1. Code Generation
- **Format**: `REF-[6-CHAR-HEX]` (e.g. `REF-M7K2P9`).
- **Uniqueness Guarantee**: Collision avoidance retry loop up to 5 attempts.
- **Service**: `getOrCreateUserReferralCode(userId)` in `ReferralService`.

### 2. Fraud & Fraud Protection
- **Self-Referral Block**: Throws `BadRequestException('You cannot redeem your own referral code')`.
- **Duplicate Redemption Block**: Ensures each user account can redeem at most one referral code (`status: COMPLETED`).

### 3. Reward Distribution Engine
- `processRewardEngine(referrerId, redeemerUserId, amount)` credits $15 to referrer and redeemer accounts upon initial booking completion.

### 4. REST Endpoints
- `GET /referrals/me` - Get/create user referral code.
- `GET /referrals/dashboard` - Get referral statistics & earnings summary.
- `POST /referrals/redeem` - Redeem friend referral code.

### 5. UI Interfaces
- **Web**: `ReferralDashboard` (`apps/web/src/components/customer/ReferralDashboard.tsx`).
- **Mobile**: `ReferralScreen` (`apps/mobile/src/screens/customer/ReferralScreen.tsx`) with native `Share.share` integration.
