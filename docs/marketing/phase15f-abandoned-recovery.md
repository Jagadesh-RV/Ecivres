# Phase 15F — Abandoned Search & Booking Recovery Engine

## Event Pipeline & Funnel Tracking
Tracks customer intent drop-off across 5 stages:
1. `SEARCH` — Unfulfilled or abandoned search intent.
2. `SERVICE_VIEW` — Service catalog view without booking start.
3. `PROVIDER_VIEW` — Provider detail view.
4. `BOOKING_FORM` — Partial schedule entry without checkout.
5. `PAYMENT` — Abandoned payment step.

## Anti-Spam & Governance Controls
- **24-Hour Cooldown Frequency Cap**: Maximum of 1 automated recovery notification per customer within a 24-hour window.
- **Opt-Out Protection**: Strictly respects `marketingOptIn` preferences before initiating recovery triggers.

## APIs
- `POST /abandoned-recovery/event`: Record funnel drop-off event.
- `GET /abandoned-recovery/events/:userId`: List unrecovered events.
- `POST /abandoned-recovery/trigger`: Trigger recovery push/email campaign.
