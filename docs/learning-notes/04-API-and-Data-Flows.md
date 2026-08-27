# EcivreS: Chunk 4 - API & Data Flows

This document covers **Phase 11 (Complete API Reference)** and **Phase 12 (End-to-End Request Tracing)** based on the *actual* endpoints found in the NestJS backend.

---

## Phase 11 — Complete API Reference

> [!CAUTION]
> **NOT IMPLEMENTED WARNING:** While the Prisma schema defines models for `Booking`, `Payment`, `Review`, and `Notification`, a codebase audit reveals that their respective controllers (`bookings.controller.ts`, `payments.controller.ts`, etc.) are completely empty. They do not have any endpoints.
> 
> The following table represents the *actually implemented* routes.

| Method | Route | Controller | Auth / Guard | Purpose |
| ------ | ----- | ---------- | ------------ | ------- |
| **POST** | `/api/v1/auth/register` | `AuthController` | None | Register a new base user. |
| **POST** | `/api/v1/auth/login` | `AuthController` | None | Authenticate and receive JWT. |
| **POST** | `/api/v1/auth/refresh` | `AuthController` | None | Rotate JWT using Refresh Token. |
| **POST** | `/api/v1/auth/logout` | `AuthController` | None | Revoke active refresh token. |
| **GET** | `/api/v1/users/me` | `UsersController` | `JwtAuthGuard` | Fetch current user info. |
| **POST** | `/api/v1/users/profiles/customer` | `UsersController` | `JwtAuthGuard` | Create Customer profile & assign role. |
| **POST** | `/api/v1/users/profiles/provider` | `UsersController` | `JwtAuthGuard` | Create Provider profile & assign role. |
| **GET** | `/api/v1/customers/profile` | `CustomersController` | `JwtAuthGuard` | Get own customer profile. |
| **POST** | `/api/v1/customers/profile` | `CustomersController` | `JwtAuthGuard` | Create customer profile (redundant with users?). |
| **PATCH** | `/api/v1/customers/profile` | `CustomersController` | `JwtAuthGuard` | Update customer profile. |
| **GET** | `/api/v1/providers/profile` | `ProvidersController` | `JwtAuthGuard` | Get own provider profile. |
| **POST** | `/api/v1/providers/profile` | `ProvidersController` | `JwtAuthGuard` | Create provider profile. |
| **PATCH** | `/api/v1/providers/profile` | `ProvidersController` | `JwtAuthGuard` | Update provider profile. |
| **POST** | `/api/v1/categories` | `CategoriesController` | `@Roles('ADMIN')` | Create a service category. |
| **GET** | `/api/v1/categories` | `CategoriesController` | Public | List all categories. |
| **GET** | `/api/v1/categories/:id` | `CategoriesController` | Public | Get single category. |
| **PATCH** | `/api/v1/categories/:id` | `CategoriesController` | `@Roles('ADMIN')` | Update a category. |
| **DELETE**| `/api/v1/categories/:id` | `CategoriesController` | `@Roles('ADMIN')` | Delete a category. |
| **POST** | `/api/v1/services` | `ServicesController` | `@Roles('PROVIDER')` | Create a new service. |
| **GET** | `/api/v1/services` | `ServicesController` | Public / `JwtAuthGuard` | List all available services. |
| **GET** | `/api/v1/services/:id` | `ServicesController` | Public | Get single service details. |
| **PATCH** | `/api/v1/services/:id` | `ServicesController` | `@Roles('PROVIDER')` | Update own service. |
| **DELETE**| `/api/v1/services/:id` | `ServicesController` | `@Roles('PROVIDER')` | Delete own service. |
| **GET** | `/api/v1/roles` | `RolesController` | `@Roles('ADMIN')` | List system roles. |
| **GET** | `/api/v1/permissions` | `PermissionsController` | `@Roles('ADMIN')` | List system permissions. |

---

## Phase 12 — End-to-End Request Tracing

Because the Booking feature is *NOT IMPLEMENTED*, we will trace the **Service Creation** flow instead. This demonstrates how a Provider uses the app to offer a service.

### Feature Trace: A Provider creates a "Plumbing Repair" service.

**1. User Action (React Native)**
*   The Provider navigates to `CreateServiceScreen.tsx` (hypothetical/ProviderNavigator).
*   They fill out a React Hook Form: `name: "Plumbing Repair"`, `price: 150`, `duration: 60`, `categoryId: "uuid-123"`.
*   They press Submit.

**2. State & Axios**
*   The form `onSubmit` handler is triggered.
*   It calls `client.post('/services', data)`.
*   The Axios request interceptor (`client.ts`) intercepts this before it leaves the phone. It asks `react-native-keychain` for the `access_token` and injects `Authorization: Bearer eyJhbGci...`.

**3. Backend Entry (NestJS)**
*   The request hits `/api/v1/services`.
*   The `ValidationPipe` intercepts the payload. It checks `CreateServiceDto` to ensure `price` is a number and `name` is a string. If it fails, NestJS immediately returns `400 Bad Request`.

**4. Guards**
*   NestJS executes `JwtAuthGuard`. It verifies the token signature and attaches the payload (email, user ID) to the `request.user` object.
*   NestJS executes `RolesGuard`. It sees the route is decorated with `@Roles('PROVIDER')`.
*   It queries Prisma: Does this `user.id` have a `UserRole` linked to the `'PROVIDER'` role? Yes. Access granted.

**5. Controller (`ServicesController`)**
*   The `@Post()` handler receives the request.
*   It uses `@CurrentUser()` to get the user ID.
*   It calls `this.servicesService.create(createServiceDto, user.id)`.

**6. Service (`ServicesService`)**
*   The Service receives the DTO.
*   It must first fetch the `ProviderProfile` associated with this `user.id` using Prisma, because the `Service` model requires a `providerId`, not a `userId`.
*   If the user has no `ProviderProfile`, it throws a `404 NotFoundException`.

**7. Database (Prisma -> PostgreSQL)**
*   The Service calls `this.prisma.service.create({...})`.
*   Prisma translates this into a PostgreSQL `INSERT INTO "Service" ...` query.
*   PostgreSQL validates the Foreign Key (`categoryId`) exists.

**8. Response**
*   The database returns the new row to Prisma.
*   Prisma returns it to the Service.
*   The Service returns it to the Controller.
*   The Controller returns `201 Created` with JSON back to the mobile app.
*   The mobile app receives the 201 response and navigates the user back to their dashboard, triggering a re-fetch of their services.

---

*This concludes Chunk 4. Next, we will cover DevOps, the Build System, Environment Variables, and Security in Chunk 5.*
