# Churn Risk Prediction Scoring & Automated Win-Back System

## Overview
The Data Intelligence Engine evaluates customer engagement telemetry to identify at-risk users before churn occurs and automatically triggers win-back promotional campaigns.

## Risk Scoring Heuristic
- **Days Inactive**: Inactivity > 60 days triggers elevated risk.
- **Loyalty Discount**: Customers with > 10 historical completed bookings receive a 20% risk offset.
- **Trigger Actions**:
  - `HIGH RISK` (churn probability >= 70%): Triggers 25% OFF win-back promo push notification.
  - `MEDIUM RISK` (churn probability 40–69%): Triggers personalized recommendation email.

## API Endpoint
- **POST** `/api/v1/data-intelligence/churn-predict`
  ```json
  {
    "customerId": "cust_88",
    "daysSinceLastBooking": 85,
    "totalHistoricalBookings": 3
  }
  ```
