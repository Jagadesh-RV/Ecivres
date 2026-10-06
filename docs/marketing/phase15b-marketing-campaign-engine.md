# Phase 15B — Marketing Campaign Engine

## Core Features
1. **Targeting & Rule Evaluation**: Category, country/location, order value threshold (`minOrderValue`), budget limits (`totalBudget`), max discount caps (`maxDiscount`), and active date window validation.
2. **Discount Calculation**: Percentage-based and fixed discount calculations with order amount bounds.
3. **Anti-Abuse Controls**: Single redemption per user per campaign code, budget limit enforcement, expired campaign protection, and stack-rule safety.
4. **Campaign ROI Analytics**: Real-time monitoring of impressions, clicks, signups, redemptions, revenue generated, discounts granted, conversion rates, and ROI percentage.

## APIs
- `POST /campaigns`: Create marketing campaign (Admin).
- `GET /campaigns/active`: List active promo campaigns.
- `POST /campaigns/redeem`: Apply promotional discount code to booking.
- `GET /campaigns/analytics/:campaignId`: Retrieve performance and ROI analytics.
