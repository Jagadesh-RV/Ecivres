# EcivreS Platform — Staging Marketplace Workflows & E2E Validation

**Date:** November 12, 2026  
**Auditor:** QA Lead & Backend Architect  
**Scope:** Marketplace Journey Verification (Authentication, Customer, Provider, Payments, Multi-Tenant)  

---

## 1. Journey Verification Overview

The EcivreS core marketplace flows were verified using authentic HTTP requests via Supertest across 7 E2E test suites (32 tests) and unit/integration test suites.

---

## 2. Verified Workflow Breakdown

### 2.1 Authentication & Session Lifecycle
- **Registration:** `POST /api/v1/auth/register` creates user account with hashed password and default customer role.
- **Login:** `POST /api/v1/auth/login` verifies bcrypt hash, returns short-lived JWT access token (15m) and secure refresh token (7d).
- **Token Refresh:** `POST /api/v1/auth/refresh` validates refresh token, generates rotated token pair.
- **Logout & Revocation:** `POST /api/v1/auth/logout` invalidates active refresh tokens in database. Idempotency verified.
- **Unauthorized Rejection:** Requests without `Bearer` token to protected endpoints return `401 Unauthorized`.

### 2.2 Customer & Discovery Workflows
- **Public Category Discovery:** `GET /api/v1/categories` responds with active service categories without requiring authentication.
- **Service & Provider Search:** Filters by category, location, and rating.
- **Booking Creation:** `POST /api/v1/bookings` with `scheduledAt`, `serviceId`, and address parameters validated via `ValidationPipe`.
- **Cancellation & Status:** Booking transitions through `PENDING` $\rightarrow$ `CONFIRMED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `COMPLETED` or `CANCELLED`.
- **Review & Rating:** Authenticated customers post reviews and 1–5 star ratings upon booking completion.

### 2.3 Provider Workflows
- **Provider Onboarding:** `POST /api/v1/providers/profile` registers business details and service specialties.
- **Service Management:** `POST /api/v1/services` allows verified providers to list offerings with pricing and duration.
- **Booking Acceptance & Completion:** Status mutations guarded by provider ownership checks.

### 2.4 Payments & Webhook Idempotency
- **Stripe Integration:** Payment intents created for confirmed bookings.
- **Webhook Processing:** Stripe webhook signatures validated; idempotency keys prevent double charging.
- **Refund Automation:** Controlled SLA and cancellation refund workflows tested.

### 2.5 Multi-Tenant & Enterprise B2B
- **Enterprise Organizations:** Multi-tier tenant accounts with scoped roles (`OWNER`, `ADMIN`, `BILLING`, `MEMBER`).
- **Negotiated Rate Cards:** Custom discount percentages locked to specific tenant IDs.
- **Purchase Order Billing:** Enterprise invoice creation with net terms and approval threshold enforcement.
