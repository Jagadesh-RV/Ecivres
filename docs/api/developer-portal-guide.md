# Developer Portal & Webhook Engine Guide

## API Key Authentication

Applications authenticate using Bearer Secret Keys:

```http
Authorization: Bearer ecv_live_9a8b7c6d5e4f3a2b
```

### Scopes Matrix

- `*`: Master Full Access
- `read:bookings`: Query booking history and status transitions
- `write:bookings`: Create and reschedule bookings
- `read:services`: Access catalog services and category discovery

## Webhook Subscriptions

Register HTTP POST webhook listeners to receive real-time updates:

```json
{
  "event": "booking.completed",
  "timestamp": "2026-10-05T12:00:00Z",
  "data": {
    "bookingId": "bk_99812",
    "totalAmount": 150
  }
}
```
