# Service Discovery Architecture & API Specification

## 1. Overview
The Service Discovery engine enables customers to search, filter, sort, and paginate through the marketplace catalog across Web and Mobile applications.

## 2. API Endpoint Specification

### `GET /services/search`

#### Query Parameters:
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `query` | `string` | `undefined` | Keyword search against service name & description |
| `categoryId` | `string` | `undefined` | Filter by specific service category |
| `providerId` | `string` | `undefined` | Filter by provider profile ID |
| `minPrice` | `number` | `0` | Minimum service price threshold |
| `maxPrice` | `number` | `undefined` | Maximum service price threshold |
| `minRating` | `number` | `undefined` | Minimum provider rating (e.g. 4.0+) |
| `sortBy` | `enum` | `newest` | `newest`, `price_asc`, `price_desc`, `rating` |
| `page` | `number` | `1` | Pagination page number |
| `limit` | `number` | `10` | Number of items per page |

#### Response Schema:
```json
{
  "items": [
    {
      "id": "srv_101",
      "name": "Deep Carpet Cleaning",
      "description": "Professional steam carpet cleaning",
      "price": 120.00,
      "duration": 60,
      "category": { "id": "cat_1", "name": "Cleaning" },
      "provider": { "id": "prov_1", "businessName": "Sparkle Clean LLC", "isVerified": true }
    }
  ],
  "totalItems": 45,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

## 3. Frontend & Mobile Integration
- **Web**: `AdvancedSearchBar.tsx`, `ServiceFilterDrawer.tsx`, `ServiceCatalogSkeleton.tsx`, `CustomerServicesPage`.
- **Mobile**: `ServiceSearchHeader.tsx`, `CategoryChipsBar.tsx`, `FilterBottomSheet.tsx`, `InfiniteScrollServiceList.tsx`.
