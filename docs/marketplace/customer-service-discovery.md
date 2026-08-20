# Customer Service Discovery Flow

## Overview
This document outlines the API and mobile flows implemented for the marketplace discovery feature (Phase 4B). The functionality allows an authenticated customer to browse categories, discover services, view detailed service information, and review provider details using real backend data.

## Mobile Flow Architecture

The user journey is handled through `CustomerNavigator` and relies entirely on actual API responses rather than hardcoded states.

1. **Customer Dashboard**: Displays top-level calls to action. Customers tap "Browse Services" to begin discovery.
2. **Category List**: (`CategoryListScreen.tsx`) Calls `GET /categories` to show all active service categories dynamically.
3. **Service List**: (`ServiceListScreen.tsx`) Calls `GET /services?categoryId={id}` when a category is selected. Displays a FlatList of available services.
4. **Service Details**: (`ServiceDetailsScreen.tsx`) Calls `GET /services/{id}` to fetch comprehensive details about a specific service, including its relation to the provider profile.
5. **Provider Details**: (`ProviderDetailsScreen.tsx`) A safe abstraction of the provider profile nested inside the service object. Avoids exposing sensitive backend IDs or user table details.

## API Flow
The mobile application uses the existing customized Axios instance (`services/api/client.ts`) for all API communications. It fully supports:
- Automatic JWT Injection via interceptors
- Refresh token handling
- Graceful error responses

### Domain Services
- `categoryService`: Handles category-level fetching.
- `serviceService`: Handles filtering and single-item retrieval for services.

## Error Handling
- Failed network requests are caught and wrapped in user-friendly messages like "Failed to load categories" or "Service is no longer available."
- Explicit "Retry" actions are displayed in empty states and error boundaries.

## Known Limitations & Next Steps
- The **Book Service** button is currently implemented as an informative alert/stub. Booking creation will be unlocked in Phase 5 once the backend booking contract is finalized.
