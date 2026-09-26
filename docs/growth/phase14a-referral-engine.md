# Phase 14A — Viral Referral & Growth Engine

## Overview
Architected multi-tier referral loop rewarding $15 USD for qualified referee completions.

## Core Features
1. **Dynamic QR Generator**: Base64 encoded payload URL pointing to native app deep links.
2. **Invite Tracking**: Tracks `ReferralTreeRecord` state (`PENDING` -> `QUALIFIED` -> `REWARDED`).
3. **Anti-Fraud Engine**: Fingerprint cross-matching for IP & Device IDs to block self-referrals.

## APIs
- `POST /viral-referral/track`: Track new invite registration.
- `POST /viral-referral/qualify-reward`: Qualify booking completion reward.
- `POST /viral-referral/fraud-check`: Evaluate fraud risk.
