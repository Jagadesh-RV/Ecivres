# Automatic Review Trigger & Eligibility Engine

## Overview

To maintain high marketplace trust and verified provider ratings, EcivreS automatically prompts customers for reviews immediately upon service completion while enforcing strict eligibility checks to prevent fraud or double-reviewing.

## Eligibility Rules

A customer is eligible to submit a review if:
1. **Ownership**: The requesting user is the customer who placed the booking.
2. **State Verification**: The booking status is `COMPLETED`.
3. **Uniqueness**: No prior review exists for this booking ID (`booking.review === null`).

## API Endpoint

- `GET /reviews/eligibility/:bookingId`
  - Returns `{ eligible: true, booking: ... }` if valid.
  - Returns `{ eligible: false, reason: "..." }` if ineligible.

## UI Components

- **Web Modal**: `ReviewCompletionModal.tsx` (`apps/web/src/components/reviews/ReviewCompletionModal.tsx`)
- **Mobile Screen**: `ReviewScreenTrigger.tsx` (`apps/mobile/src/screens/ReviewScreenTrigger.tsx`)
