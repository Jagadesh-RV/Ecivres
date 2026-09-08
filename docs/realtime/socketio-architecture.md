# Socket.IO Real-Time Architecture

## Namespace & Connection
- **Namespace**: `/realtime`
- **Transport**: WebSockets primary with HTTP long-polling fallback.

## Rooms
- `user_${userId}`: Direct personal notifications and status updates.
- `booking_${bookingId}`: Booking state timeline events (`booking.created`, `booking.accepted`, `booking.started`, `booking.completed`, `booking.rejected`).

## Presence Tracking
- Emits `provider.online` and `provider.offline` on provider socket connection and explicit status toggles.
