# EcivreS: Chunk 2 - Codebase Deep Dives

This document covers **Phase 4 (Mobile Deep Dive)**, **Phase 5 (Backend Deep Dive)**, **Phase 9 (Prisma Deep Dive)**, and **Phase 10 (PostgreSQL Fundamentals)**.

---

## Phase 4 — Mobile Deep Dive (React Native)

The React Native application is housed in `apps/mobile/`.

### 1. The Entry Point
*   **`index.js`**: The absolute entry point for the React Native bundler (Metro). It imports `App.tsx` and registers it with `AppRegistry.registerComponent`.
*   **`App.tsx`**: The root React component. It wraps the application in a `SafeAreaProvider` (to avoid notches) and renders the `<AppNavigator />`.

### 2. Navigation Architecture
EcivreS uses **React Navigation** (specifically `@react-navigation/native-stack`). The navigation logic is centralized in `src/navigation/AppNavigator.tsx`.
It uses a highly dynamic conditional rendering system based on global state:
1.  **Loading State**: Shows a spinner while checking for tokens.
2.  **Unauthenticated**: Renders `<AuthNavigator />` (Login, Register screens).
3.  **No Profile**: Renders `<ProfileSetupNavigator />` (Forces the user to complete their profile).
4.  **Role Provider**: Renders `<ProviderNavigator />` if the user array contains the `'PROVIDER'` role.
5.  **Role Customer**: Renders `<CustomerNavigator />`.

This guarantees that a Customer can never accidentally navigate to a Provider dashboard because those routes aren't even mounted in the React tree for them.

### 3. State Management (Zustand)
The app uses Zustand for global state management, located in `src/stores/authStore.ts`.
*   **Why Zustand?** It avoids the heavy boilerplate of Redux.
*   **How it works:** `useAuthStore` manages `user`, `isAuthenticated`, and `isLoading`.
*   **Session Restoration (`restoreSession`):** On app startup, Zustand checks `react-native-keychain` for saved credentials. If an `access_token` exists, it makes a request to `/users/me`. If successful, the user is logged in automatically.

### 4. API Communication (Axios)
The Axios client is configured in `src/services/api/client.ts`.
*   It points to `process.env.EXPO_PUBLIC_API_URL` (another piece of documentation drift—it relies on an Expo environment variable despite being a bare CLI app, likely loaded via a babel plugin).
*   It uses **interceptors** (`requestInterceptor`, `responseInterceptor`) to automatically attach the JWT token to every outgoing request and handle token refreshing if a 401 Unauthorized is returned.

---

## Phase 5 — Backend Deep Dive (NestJS)

The NestJS backend is located in `apps/api/`.

### 1. Application Bootstrap
*   **`src/main.ts`**: The entry point. It calls `NestFactory.create(AppModule)`.
*   **Global Configs applied here:**
    *   `app.setGlobalPrefix('api/v1')` - Every endpoint starts with this.
    *   `ValidationPipe` - Automatically validates incoming JSON against DTO classes. Strips out malicious properties (`whitelist: true`, `forbidNonWhitelisted: true`).
    *   `SwaggerModule` - Auto-generates OpenAPI documentation at `/api/docs`.

### 2. The Module System
NestJS is built on Modules. `src/app.module.ts` imports 13 distinct feature modules (e.g., `AuthModule`, `BookingsModule`, `UsersModule`).
*   This enforces a clean separation of concerns. If you want to change how Payments work, you only touch `src/modules/payments/`.

### 3. Controllers and Services
*   **Controller**: Handles incoming HTTP requests, extracts parameters, and returns the response. It does *not* contain business logic.
*   **Service**: Contains the actual business logic (e.g., calculating prices, checking permissions). It is injected into the Controller via Dependency Injection.

---

## Phase 9 — Prisma Deep Dive

Prisma is the ORM (Object-Relational Mapper) used to interact with PostgreSQL.

### 1. `schema.prisma`
Located in `apps/api/prisma/schema.prisma`. It is the single source of truth for the database schema.
*   **Models**: Defines tables (e.g., `model User`, `model Booking`).
*   **Relations**: Easily maps relationships. For example, a `User` can have multiple `Bookings`.
*   **Enums**: `BookingStatus` restricts statuses to `PENDING`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`.

### 2. Deep Dive: The `User` Model
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())

  // Relations
  userRoles       UserRole[]
  customerProfile CustomerProfile?
  providerProfile ProviderProfile?
}
```
*   `@id @default(uuid())`: The Primary Key is an auto-generated UUID, making the database safer from ID enumeration attacks than sequential integers.
*   `@unique`: Ensures no two users share an email.
*   `CustomerProfile?`: The `?` denotes an optional one-to-one relationship. A User might not have a profile yet.

---

## Phase 10 — PostgreSQL Fundamentals in EcivreS

EcivreS uses PostgreSQL, a robust relational database. How does Prisma map to Postgres?

### 1. Relational Integrity (Foreign Keys)
In Prisma: `user User @relation(fields: [userId], references: [id], onDelete: Cascade)`
In Postgres, this creates a **Foreign Key Constraint**.
*   `fields: [userId]`: The column in the current table.
*   `references: [id]`: The column it points to in the `User` table.
*   `onDelete: Cascade`: If the `User` is deleted, PostgreSQL automatically deletes this connected record to prevent orphaned data.

### 2. Join Tables (Many-to-Many)
EcivreS uses explicit Join Tables for roles:
```prisma
model UserRole {
  userId    String
  roleId    String
  @@id([userId, roleId])
}
```
In Postgres, this creates a table with a **Composite Primary Key** (`@@id`). A user can have many roles, and a role can have many users. This table bridges them.

### 3. Migrations
When you run `pnpm db:migrate`, Prisma generates raw SQL based on `schema.prisma` and applies it to Postgres. This ensures that the database schema precisely matches the TypeScript types.

---

*This concludes Chunk 2. Next, we will dive deeply into Authentication, Authorization (RBAC), and Customer/Provider workflows in Chunk 3.*
