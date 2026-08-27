# EcivreS: Chunk 3 - Auth & Authorization

This document covers **Phase 6 (Authentication)**, **Phase 7 (RBAC Deep Dive)**, and **Phase 8 (Customer & Provider Architecture)**.

---

## Phase 6 — Authentication (JWT Lifecycle)

EcivreS uses JSON Web Tokens (JWT) for authentication. The logic is concentrated in `apps/api/src/modules/auth/auth.service.ts`.

### 1. Registration (`/auth/register`)
When a user submits the registration form on the mobile app (`apps/mobile/src/screens/auth/RegisterScreen.tsx`):
1.  **Backend receives DTO**: The `RegisterDto` validates that the payload has a valid email and strong password.
2.  **Hashing**: `auth.service.ts` uses `bcrypt.hash(password, 10)` to securely hash the password. The raw password is *never* stored in the database.
3.  **Creation**: A Prisma query creates the user.
4.  **Token Generation**: Two tokens are created:
    *   **Access Token**: A short-lived JWT created via `@nestjs/jwt`. Contains `{ email, sub: user.id }`.
    *   **Refresh Token**: A cryptographically secure random string (`crypto.randomBytes(64).toString('hex')`). This string is hashed via bcrypt and stored in the database, while the plain string is returned to the user.
5.  **Storage**: The mobile app receives both tokens and stores them securely using `react-native-keychain`.

### 2. Login (`/auth/login`)
1.  **Verification**: Finds the user by email. Uses `bcrypt.compare()` to verify the provided password against the hashed password in the database.
2.  **Token Issuance**: Generates a new Access Token and Refresh Token, just like registration.

### 3. Token Refresh and Rotation (`/auth/refresh`)
If an Access Token expires (returns 401), the mobile app's Axios interceptor automatically calls `/auth/refresh` using the stored Refresh Token.
1.  **Validation**: The backend iterates through the user's active refresh tokens in the database, using `bcrypt.compare()` to find a match.
2.  **Rotation**: The used Refresh Token is immediately deleted from the database. A brand new Access Token and Refresh Token are issued. This is a critical security feature (Refresh Token Rotation).

---

## Phase 7 — RBAC Deep Dive (Role-Based Access Control)

RBAC is the core of EcivreS's multi-user functionality. It allows the same API endpoints to serve Customers and Providers differently based on their assigned roles.

### 1. The `@Roles()` and `@Permissions()` Decorators
NestJS allows custom decorators. If you look at any protected route, you might see:
```typescript
@Roles('ADMIN', 'PROVIDER')
@Get('dashboard')
```
This decorator attaches metadata to the route.

### 2. The Guards (`roles.guard.ts` & `permissions.guard.ts`)
Guards act as bouncers. They run *before* the Controller code executes.

**How `RolesGuard` Works (`apps/api/src/common/guards/roles.guard.ts`):**
1.  **Extract Metadata**: It reads the required roles from the route's decorator (e.g., `['ADMIN', 'PROVIDER']`).
2.  **Get User**: It extracts the `user.id` from the decoded JWT.
3.  **Database Lookup**: It uses Prisma to fetch the user *along with their nested roles*.
    ```typescript
    const userWithRoles = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { userRoles: { include: { role: true } } },
    });
    ```
4.  **Evaluation**: It maps the database results into an array of string names (e.g., `['CUSTOMER']`) and checks if `requiredRoles.some(...)` matches. If not, it returns `false`, and NestJS automatically throws a `403 Forbidden` error.

**How `PermissionsGuard` Works:**
It functions similarly but digs one level deeper in the database relational tree. It maps `user -> userRoles -> role -> rolePermissions -> permission` to build a `Set` of permission names, and ensures the user has *every* required permission (`requiredPermissions.every(...)`).

---

## Phase 8 — Customer & Provider Architecture

Because EcivreS serves both service consumers (Customers) and service creators (Providers), the database design reflects this duality.

### The Profile Split
In `schema.prisma`, the `User` model has optional one-to-one relations with profiles:
*   `customerProfile CustomerProfile?`
*   `providerProfile ProviderProfile?`

### The Workflow Trace
1.  **Registration**: A user creates an account. They are just a base `User` with no roles.
2.  **Profile Setup**: The mobile app's `AppNavigator` detects `isProfileComplete === false`. It routes them to `ProfileSetupScreen.tsx`.
3.  **Role Selection**: The user chooses whether to be a Customer or a Provider.
4.  **Profile Creation**: 
    *   If Provider: An endpoint creates a `ProviderProfile` (with `businessName`) and assigns the `PROVIDER` role to `UserRole`.
    *   If Customer: An endpoint creates a `CustomerProfile` (with `firstName`, `lastName`) and assigns the `CUSTOMER` role.
5.  **Navigation Shift**: The mobile app fetches the updated user object. The `AppNavigator` re-evaluates.
    *   If `user.roles.includes('PROVIDER')`, it unmounts the Setup screen and mounts `<ProviderNavigator />` (showing service creation tools).
    *   Otherwise, it mounts `<CustomerNavigator />` (showing the marketplace feed).

This guarantees absolute separation of concerns on the frontend, while reusing the same authentication layer on the backend.

---

*This concludes Chunk 3. Next, we will cover complete API and Data Flows in Chunk 4.*
