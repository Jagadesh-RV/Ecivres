# JWT Token Lifecycle & Rotation Specification

## Architecture Overview
EcivreS uses short-lived JWT Access Tokens paired with long-lived Refresh Tokens stored with cryptographic hashes in PostgreSQL.

## Access Token
- **Lifetime**: 15 minutes
- **Claims**: `{ sub: string, email: string, roles: string[] }`
- **Signing**: HMAC-SHA256 with `JWT_SECRET`

## Refresh Token & Rotation
- **Lifetime**: 7 days
- **Storage**: Hashed via `HMAC-SHA256` (`HMAC:<hash>`) in `RefreshToken` database table.
- **Rotation Rule**: Presenting a refresh token invalidates the used token and generates a new pair.
- **Revocation**: `POST /auth/logout` revokes current token; `POST /auth/revoke-all-sessions` revokes all active tokens for the user.
