# Natural Language Smart Search

## Overview
EcivreS Smart Search interprets natural language queries from customers to extract search intent, category keywords, scheduling preferences, location parameters, and price thresholds.

## Intent Classification
- **BOOKING_SEARCH**: Direct booking requests (e.g., "Schedule plumbing for tomorrow morning").
- **PROVIDER_SEARCH**: Finding top providers/contractors (e.g., "Best electrician near me").
- **PRICE_INQUIRY**: Budget-constrained searches (e.g., "House cleaning under $100").
- **GENERAL_SEARCH**: Fallback standard keyword search.

## Entity Extraction
1. **Date & Time**: Recognizes relative dates (`today`, `tomorrow`, `weekend`, `next week`) and time slots (`MORNING`, `AFTERNOON`, `EVENING`).
2. **Location & Distance**: Recognizes proximity triggers (`near me`, `close by`) and explicit distance boundaries (`within 10 km`).
3. **Price Limits**: Extracts numerical budget caps (`under $200`).
4. **Service Taxonomy**: Maps natural text to marketplace service categories.

## Endpoints
`POST /ai/smart-search`

### Request Body
```json
{
  "query": "AC repair near me tomorrow morning under $200",
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

## Frontend Components
- **Web**: `SmartSearchBar` (`apps/web/src/components/catalog/SmartSearchBar.tsx`)
- **Mobile**: `MobileSmartSearchBar` (`apps/mobile/src/components/MobileSmartSearchBar.tsx`)
