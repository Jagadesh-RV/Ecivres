# Testing Strategy

EcivreS employs a multi-tiered testing strategy utilizing Jest.

## Backend Unit Tests
Unit tests are located alongside the files they test (e.g., `auth.service.spec.ts`).

### Current Coverage:
- **`AuthService`**: Tests are scaffolding and currently marked as `it.todo`. They need implementation to mock the `PrismaService` and `JwtService` to test registration, login, and refresh logic.
- **`AppController` / `AppService`**: Basic instantiation tests.
- **Controllers**: Controller tests (e.g., `users.controller.spec.ts`, `auth.controller.spec.ts`) exist but are largely scaffolded.

### Testing RBAC (Future Implementation)
When implementing tests for the `RolesGuard`, the following cases MUST be covered:
- **No JWT:** Request without token -> `401 Unauthorized`
- **Invalid Signature:** Request with tampered token -> `401 Unauthorized`
- **Wrong Role:** e.g., Customer attempting to access `/admin` -> `403 Forbidden`
- **Correct Role:** e.g., Admin attempting to access `/admin` -> `200 OK`

## Mobile Unit Tests
The mobile application is configured for Jest testing (`apps/mobile/jest.config.js`). 
- Currently, there is no significant test coverage for React components or the Zustand `authStore`.

## CI/CD Pipeline Integration
Tests can be executed across the entire monorepo using:
```bash
pnpm run test
```
This script recursively executes testing within `apps/api` and `apps/mobile`.
