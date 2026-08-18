# Service Marketplace Core

## Overview

The EcivreS Marketplace Core is the foundational implementation of the service discovery and booking flows. It provides the ability for Customers to browse categories, list services, view service details, inspect provider profiles, and initiate bookings.

## Backend Architecture

The backend implementation resides in `apps/api/src/modules/` and builds on top of the established Prisma schema and Role-Based Access Control (RBAC).

### Modules Implemented

1. **Categories Module (`/api/v1/categories`)**
   - Retrieves all available service categories.
   - Publicly accessible for authenticated users (`JwtAuthGuard`).

2. **Services Module (`/api/v1/services`)**
   - **List Services**: Allows optional filtering by `categoryId`. Includes basic Provider information.
   - **Service Details**: Retrieves comprehensive service metadata, including Provider profile data (omitting sensitive user secrets).
   - **Provider Management**: Providers can create (`POST`), update (`PATCH`), and delete (`DELETE`) their own services. Ownership is strictly verified using `req.user.id` against the `ProviderProfile`.

3. **Bookings Module (`/api/v1/bookings`)**
   - **Create Booking**: A Customer can initiate a booking by providing `serviceId` and `scheduledAt`. The backend strictly enforces that the user has a `CustomerProfile` and assigns the booking to them.
   - **List Bookings**: Retrieves the current Customer's upcoming and past bookings.

### Authorization Security

- **Strict Identity Checking**: Instead of relying solely on `@Roles()` decorators, the backend guarantees marketplace integrity by verifying the existence of `ProviderProfile` or `CustomerProfile` linked to the JWT `user.id`.
- **Ownership Boundaries**: A Provider cannot modify services belonging to another Provider. A Customer cannot book on behalf of another Customer.

## Mobile Architecture

The mobile application connects to the marketplace API using the shared Axios `apiClient`, managing UI state locally via React hooks.

### Navigation

The Customer flow is managed within `CustomerNavigator.tsx`:
- `CustomerDashboard`: Displays top categories and featured services.
- `CategoryListScreen`: Browses all categories.
- `ServiceListScreen`: Lists services, filtered by the chosen category.
- `ServiceDetailsScreen`: Displays pricing, duration, and the "Book" action.
- `ProviderDetailsScreen`: Displays public information about the service provider (business name, verified status).

### Services

- `categoryService.ts`
- `serviceService.ts`
- `bookingService.ts`

These utilities securely consume the `/api/v1` routes utilizing the `react-native-keychain` bearer tokens attached via Axios interceptors.
