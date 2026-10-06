# Phase 15E — Customer Lifecycle, Retention & Reactivation Engine

## Lifecycle Segments & Deterministic Rules
1. **HIGH_VALUE**: Total spend >= $1,000 OR booking count >= 10.
2. **DORMANT**: Days since last booking > 90.
3. **AT_RISK**: Days since last booking > 45.
4. **REPEAT_CUSTOMER**: Booking count >= 3.
5. **ACTIVE**: Booking count >= 1.
6. **ACTIVATED**: Recent sign up with initial search/profile activity (within 7 days).
7. **NEW**: Unactivated initial registration.

## Opt-Out & Preference Safety Rules
All automated marketing promotions and reactivation campaign offers verify `marketingOptIn` settings before dispatching notifications to comply with privacy policy.

## APIs
- `GET /customer-lifecycle/segment?bookings=5&spend=450&daysSinceLast=12`: Evaluate segment.
- `GET /customer-lifecycle/retention-offer?userId=usr_1&segment=AT_RISK&optIn=true`: Fetch retention promo.
- `POST /customer-lifecycle/reactivate`: Trigger automated reactivation flow.
