# Provider Booking Workflow & Acceptance Logic

## Overview

The Provider Booking Workflow enables service providers to review incoming client booking requests, accept or reject bookings, reschedule booked slots, and track order status transitions towards service completion.

## Booking Lifecycle States & Transitions

```
[PENDING] ---> (Accept) ------> [CONFIRMED] ---> (Complete Service) ---> [COMPLETED]
    |                                 |
    +------> (Reject/Cancel) -> [CANCELLED] <----+
```

### Supported Provider Actions

1. **Accept Booking (`PATCH /bookings/:id/accept`)**:
   - Status changes from `PENDING` to `CONFIRMED`.
   - Sends real-time notification to the customer.
   - Locks the scheduled time slot for the provider.

2. **Reject Booking (`PATCH /bookings/:id/reject`)**:
   - Status changes from `PENDING` to `CANCELLED`.
   - Records optional rejection reason.
   - Releases provider availability.

3. **Reschedule Booking (`PATCH /bookings/:id/reschedule`)**:
   - Updates `scheduledAt` timestamp to a newly chosen date and time slot.
   - Performs provider conflict check before confirming new schedule.

4. **Update Status / Complete Service (`PATCH /bookings/:id/status`)**:
   - Allows transitioning to `COMPLETED` when service is fulfilled.
   - Unlocks review eligibility for customer.
   - Updates provider earnings ledger.

## API Specification

- `GET /bookings/provider`: List all assigned bookings for current provider.
- `PATCH /bookings/:id/accept`: Confirm booking request.
- `PATCH /bookings/:id/reject`: Decline booking request with optional body `{ reason?: string }`.
- `PATCH /bookings/:id/reschedule`: Reschedule booking with body `{ scheduledAt: ISOString }`.

## UI Integration

- **Web**: `ProviderBookingsTable.tsx` and `ProviderRescheduleModal.tsx` in `/provider/bookings`.
- **Mobile**: `IncomingBookingCard.tsx`, `ProviderBookingActionsBar.tsx`, and `ProviderBookingsScreen.tsx`.
