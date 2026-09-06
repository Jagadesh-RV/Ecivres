# Booking Creation Engine Specification

## 1. Overview
The Booking Creation Engine allows customers to select a service, choose a date and time window, provide optional delivery address and special instructions, and dispatch a reservation request to the provider.

## 2. Validation & Conflict Detection Rules
1. **Customer Profile Verification**: Ensures the authenticated user has an active customer profile before booking.
2. **Provider Availability Validation**: Validates that the requested date falls within the provider's operating hours.
3. **Time Slot Conflict Check**: Queries existing bookings for the target service at the same `scheduledAt` timestamp with status `PENDING`, `CONFIRMED`, or `IN_PROGRESS`. If a booking exists, a `BadRequestException` ("The selected time slot is already booked for this service") is thrown.

## 3. Workflow & Data Relationships
```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Web/Mobile
    participant API as NestJS API
    participant DB as PostgreSQL
    actor Provider

    Customer->>Web/Mobile: Select date & time slot
    Web/Mobile->>API: POST /bookings (CreateBookingDto)
    API->>DB: Check customer profile & time conflicts
    DB-->>API: Conflict check clear
    API->>DB: Create Booking (status: PENDING)
    API->>DB: Create Payment record (status: PENDING)
    API->>Provider: Send Notification ("New Booking Request")
    API-->>Web/Mobile: Return Booking JSON
    Web/Mobile-->>Customer: Redirect to Confirmation Screen
```
