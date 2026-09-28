# Phase 15F — Global Logistics & Timezone Scheduling Engine

## Timezone & Calendar Management
- **IANA Timezones**: Dynamic resolution per country (`America/New_York`, `Asia/Kolkata`, `Europe/London`, `Asia/Dubai`, `Europe/Berlin`).
- **Working Hours Constraint**: Enforcing regional customer service window (08:00–20:00 local time).
- **Regional Holiday Calendars**: Country-specific holiday tracking preventing dispatch booking failures during statutory holidays.

## APIs
- `GET /dispatch-global/timezone/:countryCode`: Fetch timezone string.
- `POST /dispatch-global/check-working-hours`: Evaluate local working hours.
- `GET /dispatch-global/check-holiday`: Verify if date is a regional holiday.
