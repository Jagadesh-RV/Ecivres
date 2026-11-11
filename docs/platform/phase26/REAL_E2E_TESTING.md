# EcivreS Platform — Real HTTP End-to-End Marketplace Testing

**Date:** November 10, 2026  
**Auditor:** Quality Assurance Lead & Backend Architect  

---

## 1. E2E Test Architecture & Transition

In earlier phases, several tests in `apps/api/test/` contained superficial assertions (`expect(app).toBeDefined()`).
In Phase 26, the entire E2E test suite was upgraded to execute genuine HTTP requests over `supertest` against the initialized NestJS Express application server:

| Test File | Verified Scenarios | HTTP Method & Route | Status |
| :--- | :--- | :--- | :--- |
| **`test/app.e2e-spec.ts`** | Root application health | `GET /` | **PASS (200 OK)** |
| **`test/security-headers.e2e-spec.ts`** | Helmet security headers (CSP, X-Frame-Options, nosniff) | `GET /health/live` | **PASS (200 OK)** |
| **`test/booking-journey.e2e-spec.ts`** | Liveness probe, service catalog discovery, category guard, multi-tenant guard, input validation, auth guard | `GET /health/live`<br>`GET /categories`<br>`POST /categories`<br>`POST /enterprise-b2b/org`<br>`POST /auth/login` | **PASS (6/6 tests)** |
| **`test/rbac.e2e-spec.ts`** | RBAC role & permission enforcement via signed JWTs | `GET /test-rbac/admin-only`<br>`GET /test-rbac/permission-only` | **PASS (5/5 tests)** |
| **`test/refresh-token-rotation.e2e-spec.ts`** | Refresh token validation, logout idempotency, session revocation | `POST /auth/refresh`<br>`POST /auth/logout`<br>`POST /auth/revoke-all` | **PASS (3/3 tests)** |
| **`test/auth.e2e-spec.ts`** | User registration, login, profile retrieval, logout | `POST /api/v1/auth/register`<br>`POST /api/v1/auth/login`<br>`GET /api/v1/users/me`<br>`POST /api/v1/auth/logout` | **PASS (4/4 tests)** |

---

## 2. Test Execution Evidence

```bash
$ pnpm --filter api run test:e2e
$ jest --config ./test/jest-e2e.json

PASS test/rbac.e2e-spec.ts (12.023 s)
PASS test/refresh-token-rotation.e2e-spec.ts (12.034 s)
PASS test/app.e2e-spec.ts (12.039 s)
PASS test/security-headers.e2e-spec.ts (12.065 s)
PASS test/booking-journey.e2e-spec.ts (12.065 s)
PASS test/auth.e2e-spec.ts (12.275 s)

Test Suites: 6 passed, 6 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        13.609 s
Exit code:   0
```

---

## 3. Real HTTP Verification Details

1. **Authentication Gate**: Missing credentials in `POST /auth/login` triggered global `ValidationPipe` returning `400 Bad Request`.
2. **Access Control Barrier**: `POST /categories` and `POST /enterprise-b2b/org` without Bearer JWT were intercepted by `JwtAuthGuard` returning `401 Unauthorized`.
3. **Role Enforcement**: Customer token accessing admin-only endpoint was blocked by `RolesGuard` returning `403 Forbidden`.
4. **Header Assertion**: HTTP response headers confirmed `x-content-type-options: nosniff`, `x-frame-options: SAMEORIGIN`, and `strict-transport-security`.
