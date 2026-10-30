# Partner API Security, Authentication & Rate Limiting

## 1. Overview
The Partner API platform allows verified enterprise partners to interact with EcivreS programmatically. Security is enforced through SHA-256 hashed API keys, tenant-scoped role permissions, sliding-window rate limiters, and signed outbound webhooks.

## 2. API Key Architecture
- **Format**: `ecv_live_<prefix>_<secret>`
- **Storage**: Plaintext keys are shown **only once** upon generation. The database stores strictly a SHA-256 hash `keyHash` and a non-secret identifier prefix `keyPrefix`.
- **Rotation**: Zero-downtime rotation generates a new key while retiring the previous credential with recorded audit justification.

## 3. Scoped Permissions & Tenant Isolation
Keys are restricted to explicit permission scopes:
- `bookings:read`, `bookings:write`
- `pricing:evaluate`
- `dispatch:write`
- `catalog:read`

`PartnerAuthGuard` asserts that the authenticated partner's `organizationId` matches the target resource's tenant, throwing HTTP 403 `ForbiddenException` on any cross-tenant request.

## 4. Sliding-Window Rate Limiting
`PartnerRateLimiterService` implements a 60-second sliding window:
- Default: 120 requests/minute (configurable per partner tier).
- Over-limit requests receive HTTP 429 `Too Many Requests` with `retryAfterSeconds` response headers.
