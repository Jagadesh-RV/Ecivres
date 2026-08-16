# File Architecture Map

This map outlines the most critical files in the EcivreS monorepo and their architectural responsibilities.

## Mobile Application (`apps/mobile/`)

| Path | Purpose & Responsibilities | Used By / Depends On |
|------|----------------------------|----------------------|
| `src/navigation/AppNavigator.tsx` | Master navigation controller. Decides which navigator to show based on `authStore` state. | Depends on: `authStore`, all sub-navigators. |
| `src/stores/authStore.ts` | Zustand store for managing JWT tokens, user object, and profile completion status. | Depends on: `AsyncStorage`, `apiClient`. |
| `src/services/api/client.ts` | Base Axios configuration connecting to the NestJS API. | Used by: all frontend services and components. |
| `src/services/api/interceptors.ts` | Automatically injects `Authorization` headers and intercepts `401` errors to trigger token refresh. | Used by: `client.ts`. |
| `src/screens/auth/LoginScreen.tsx` | UI for user login. Submits credentials and calls `authStore.login()`. | Depends on: `authStore`. |

## Backend Application (`apps/api/`)

| Path | Purpose & Responsibilities | Used By / Depends On |
|------|----------------------------|----------------------|
| `src/main.ts` | Bootstraps the NestJS app, applies global validation pipes, exception filters, and configures Swagger. | Entry point. |
| `src/prisma/prisma.service.ts` | Wraps the Prisma Client and injects the `PrismaPg` adapter for PostgreSQL connectivity. | Injected into all Services. |
| `src/modules/auth/auth.controller.ts` | Exposes `/auth/login`, `/auth/register`, and `/auth/refresh` HTTP endpoints. | Depends on: `AuthService`. |
| `src/modules/auth/auth.service.ts` | Implements business logic for bcrypt hashing, JWT signing, and refresh token rotation. | Depends on: `JwtService`, `PrismaService`. |
| `src/modules/auth/strategies/jwt.strategy.ts` | Passport strategy that validates the JWT signature and extracts the user payload. | Used by: `JwtAuthGuard`. |
| `src/modules/auth/guards/jwt-auth.guard.ts` | Protects endpoints from unauthenticated requests. | Used via `@UseGuards()` in Controllers. |
| `src/common/decorators/current-user.decorator.ts` | Extracts the validated user identity from the Express Request object for IDOR prevention. | Used by: Controllers. |

## Infrastructure & Configuration

| Path | Purpose & Responsibilities | Used By / Depends On |
|------|----------------------------|----------------------|
| `/docker-compose.yml` | Spins up PostgreSQL (port `5433`), Redis, and MongoDB containers. | Used by: Developers (`docker compose up`). |
| `/.env` | Root environment variables containing the `DATABASE_URL` and `JWT_*` secrets. | Used by: NestJS `ConfigModule`, Prisma CLI. |
| `apps/api/prisma/schema.prisma` | Defines the database schema, models, and relations. | Used by: Prisma CLI to generate client and migrations. |
| `apps/api/prisma.config.ts` | Configures the Prisma CLI `seed` command and ensures `dotenv` is loaded. | Used by: Prisma CLI. |
