# Service Completion & Verification Workflow

## Overview

Service Completion represents the critical transition in the booking lifecycle where a scheduled service is marked as successfully performed. Completing a service triggers automatic settlement of linked payments, ledger updates for provider earnings, and review eligibility for the customer.

## Workflow Mechanics

1. **Initiation**: Either party (Provider or Customer) can confirm completion once the booking is in `CONFIRMED` or `IN_PROGRESS` status.
2. **API Endpoint**: `PATCH /bookings/:id/complete`
   - Accepts optional payload `{ notes?: string }`.
3. **Database Actions**:
   - Booking status is updated to `COMPLETED`.
   - Linked payment record status is updated to `COMPLETED`.
   - Provider profile earnings ledger is updated.
4. **Notifications**:
   - Dispatches a real-time notification to customer and provider confirming service fulfillment.

## UI Components

- **Web Dialog**: `ServiceCompletionDialog.tsx` (`apps/web/src/components/bookings/ServiceCompletionDialog.tsx`)
- **Mobile Screen**: `CompletionConfirmationScreen.tsx` (`apps/mobile/src/screens/CompletionConfirmationScreen.tsx`)
