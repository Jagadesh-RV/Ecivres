# AI Provider Recommendation Engine

## Overview
The AI Provider Recommendation Engine analyzes provider performance, customer history, location metrics, and availability to suggest optimal providers for customers.

## Scoring Algorithm
Providers are evaluated across five weighted factors:
1. **Rating Score (30%)**: Normalized average customer review score.
2. **Completion Rate Score (25%)**: Ratio of completed bookings over total non-cancelled bookings.
3. **Response Time Score (15%)**: Evaluation of average provider response time (<15 min optimal).
4. **Distance Score (15%)**: Haversine distance calculation relative to customer coordinates.
5. **Repeat Customer Score (15%)**: Proportion of repeat customers demonstrating high retention and trust.

## Endpoint API
`GET /recommendations/providers`

### Query Parameters
- `customerId` (optional UUID)
- `latitude` (optional number)
- `longitude` (optional number)
- `categoryId` (optional UUID)
- `limit` (default 10)

## UI Components
- **Web**: `RecommendedProviderCard` (`apps/web/src/components/catalog/RecommendedProviderCard.tsx`)
- **Mobile**: `RecommendedProvidersCarousel` (`apps/mobile/src/components/RecommendedProvidersCarousel.tsx`)
