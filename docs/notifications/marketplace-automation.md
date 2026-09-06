# Marketplace Notification Automation Workflow

## Overview

The EcivreS Marketplace automatically generates real-time notifications for critical booking lifecycle events, payment settlements, and review prompts to keep both customers and service providers informed.

## Supported Marketplace Event Notifications

| Event Type | Recipient Role | Notification Title | Trigger Description |
| :--- | :--- | :--- | :--- |
| `BOOKING_CREATED` | Provider | New Booking Request | Dispatched when customer submits a booking |
| `BOOKING_ACCEPTED` | Customer | Booking Accepted | Dispatched when provider confirms booking request |
| `BOOKING_REJECTED` | Customer | Booking Declined | Dispatched when provider rejects booking request |
| `BOOKING_RESCHEDULED` | Customer / Provider | Booking Rescheduled | Dispatched when booking time slot is updated |
| `BOOKING_COMPLETED` | Customer | Service Completed | Dispatched when provider marks service complete |
| `PAYMENT_COMPLETED` | Provider | Payment Confirmed | Dispatched when payment settlement is processed |
| `REVIEW_REQUESTED` | Customer | Leave a Review | Dispatched after service completion |

## API Integration

- **Automated Event Dispatch**: `POST /notifications/trigger-event`
  - Body payload: `{ eventType: string, serviceName?: string, extra?: string }`

## UI Components

- **Web Live Center**: `LiveNotificationCenter.tsx` (`apps/web/src/components/notifications/LiveNotificationCenter.tsx`)
- **Mobile Feed**: `NotificationCenterUpdates.tsx` (`apps/mobile/src/screens/NotificationCenterUpdates.tsx`)
