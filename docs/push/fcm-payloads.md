# FCM Push Notification Payload & Deep-Linking Specification

## Target Navigation Routes
- `BOOKING_ACCEPTED`: `ecivres://customer/bookings/:bookingId`
- `BOOKING_COMPLETED`: `ecivres://customer/bookings/:bookingId/review`
- `REVIEW_REMINDER`: `ecivres://customer/reviews/new?bookingId=:bookingId`

## JSON Payload Format
```json
{
  "notification": {
    "title": "Booking Confirmed!",
    "body": "Your booking for House Cleaning has been accepted by the provider."
  },
  "data": {
    "bookingId": "b-12345",
    "type": "BOOKING_ACCEPTED",
    "deepLink": "ecivres://customer/bookings/b-12345"
  }
}
```
