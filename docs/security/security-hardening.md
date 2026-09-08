# Security Hardening Architecture & Protocol Specifications

## Overview
EcivreS Phase 7A Security Hardening enforces defense-in-depth across the API service, authentication workflow, session management, and data access layers.

## 1. JWT & Environment Enforcement
- **Production Secrets**: Removed all hardcoded or fallback JWT secrets. `ConfigService` strictly validates and requires `JWT_SECRET` and `JWT_REFRESH_SECRET` in environment configurations.
- **Access Tokens**: Short-lived (15m expiration) state-stateless JWTs containing `email`, `sub` (User ID), and `roles`.
- **Refresh Tokens**: Long-lived (7d expiration) stateful tokens stored in the database.

## 2. Refresh Token Rotation & Hashing
- **Cryptographic Hashing**: Refresh tokens are hashed using HMAC-SHA256 with `JWT_SECRET` keying (`HMAC:<sha256_hex>`) before persistence to prevent cleartext token exposure in database snapshots.
- **Rotation Rules**: Every refresh request (`/auth/refresh`) deletes the old refresh token and issues a fresh token pair (Access + Refresh token).
- **Family Revocation**: Attempted reuse of an invalid or expired refresh token triggers security detection logic to protect user credentials.
- **Concurrency Lock**: In-memory execution set (`processingRefreshTokens`) locks simultaneous duplicate refresh requests from race-condition reuse errors.

## 3. Session Management & Invalidation
- **Session Revocation**: `POST /auth/logout` invalidates the presented refresh token.
- **Global Revocation**: `POST /auth/revoke-all-sessions` invalidates all active sessions across all devices for the authenticated user by executing `deleteMany` on user refresh tokens.

## 4. Rate Limiting & Throttling
- **ThrottlerModule**: Implemented `@nestjs/throttler` with global limit of 100 requests per 60s window.
- **Auth Endpoint Throttling**: Critical endpoints (`/auth/login`, `/auth/register`, `/auth/forgot-password`) throttled strictly to 5 attempts per minute.

## 5. Security Headers & CORS
- **Helmet Middleware**: Configured Security Headers including Content Security Policy (`CSP`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and Strict Transport Security (`HSTS`).
- **Strict CORS**: Origins controlled via `CORS_ORIGINS` environment variables with strict method (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`) and header restrictions.

## 6. DTO Validation & IDOR Protection
- **ValidationPipe**: Global pipe set to `whitelist: true`, `forbidNonWhitelisted: true`, and implicit type transformation.
- **Password Policy**: Minimum 8 characters required on registration and reset password endpoints.
- **IDOR Protection**: Controller routes enforce user identity matching against JWT claims (`@CurrentUser()`) for bookings, profile edits, addresses, and provider operations.
