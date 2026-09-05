# Booking Lifecycle & State Transition Matrix

## Overview

The EcivreS Marketplace Booking Engine strictly validates state transitions to enforce workflow integrity, prevent invalid jumps (e.g. from PENDING directly to COMPLETED), and ensure consistent database state and notification dispatches.

## State Transition Matrix

| Initial State | Target State | Allowed? | Initiator Role | Side Effects |
| :--- | :--- | :--- | :--- | :--- |
| `PENDING` | `CONFIRMED` | ✅ Yes | Provider | Provider schedule locked, notification sent |
| `PENDING` | `CANCELLED` | ✅ Yes | Customer / Provider | Slot released, customer notified |
| `CONFIRMED` | `IN_PROGRESS` | ✅ Yes | Provider | Service actively being performed |
| `CONFIRMED` | `CANCELLED` | ✅ Yes | Customer / Provider | Cancellation policy applied |
| `IN_PROGRESS` | `COMPLETED` | ✅ Yes | Provider / Customer | Payment released, earnings updated, review opened |
| `IN_PROGRESS` | `CANCELLED` | ✅ Yes | Provider / Customer | Disputed cancellation flow |
| `COMPLETED` | *Any* | ❌ No | N/A | Terminal state |
| `CANCELLED` | *Any* | ❌ No | N/A | Terminal state |

## API Validation Enforcement

Any illegal transition attempt results in a `400 Bad Request` exception with payload:
```json
{
  "statusCode": 400,
  "message": "Invalid booking status transition from PENDING to COMPLETED",
  "error": "Bad Request"
}
```

## UI Components

- **Web Timeline Component**: `BookingTimeline.tsx` (`apps/web/src/components/bookings/BookingTimeline.tsx`)
- **Customer Status Page**: `/customer/bookings/[id]/status`
- **Mobile Progress Tracker**: `BookingProgressTracker.tsx` (`apps/mobile/src/screens/BookingProgressTracker.tsx`)
