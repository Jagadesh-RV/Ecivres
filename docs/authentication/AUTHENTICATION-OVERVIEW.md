# Authentication Overview (JWT Guide)

Authentication answers the question: **"Who are you?"**  
Authorization answers the question: **"What are you allowed to do?"**

In EcivreS, authentication is strictly handled using JSON Web Tokens (JWT). This guide explains what JWTs are, how they work, and exactly how they are implemented in our NestJS backend.

## What is a JWT?
A JSON Web Token (JWT) is an open standard that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.

> [!WARNING]
> JWTs are **signed, not encrypted**. Anyone who intercepts a JWT can read the payload. Never put sensitive information like passwords or credit card numbers inside a JWT payload.

## JWT Structure
A JWT consists of three parts separated by dots (`.`):
`HEADER.PAYLOAD.SIGNATURE`

### 1. Header
The header typically consists of two parts: the type of the token (`JWT`) and the signing algorithm being used.
EcivreS uses `HS256` (HMAC SHA-256).
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### 2. Payload
The payload contains the **claims** (statements about the user).
In EcivreS (`apps/api/src/modules/auth/auth.service.ts`), our payload contains:
- `sub`: The subject (the user's UUID).
- `email`: The user's email address.
- `roles`: An array of role strings (e.g., `["CUSTOMER"]`).
- `iat`: Issued At (automatically appended by `@nestjs/jwt`).
- `exp`: Expiration time (automatically appended by `@nestjs/jwt`).

```json
{
  "sub": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "roles": ["CUSTOMER"],
  "iat": 1692040000,
  "exp": 1692043600
}
```

### 3. Signature
The signature is created by taking the encoded header, the encoded payload, a secret (stored in our `.env` as `JWT_ACCESS_SECRET`), and the `HS256` algorithm.

```javascript
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  process.env.JWT_ACCESS_SECRET
)
```

## How the Backend Verifies It
When the mobile app sends a request to a protected endpoint (e.g., `/users/me`), it includes the token in the `Authorization: Bearer <token>` header.

The `JwtAuthGuard` uses the `JwtStrategy` (`apps/api/src/modules/auth/strategies/jwt.strategy.ts`) to:
1. Extract the token from the header.
2. Verify the signature using the server's `JWT_ACCESS_SECRET`.
3. Check that the token hasn't expired (`exp`).
4. If valid, it extracts the payload and attaches it to the request object (`req.user = payload`).

> [!IMPORTANT]  
> Modifying the payload invalidates the signature! If a malicious user changes their role from `["CUSTOMER"]` to `["ADMIN"]` in the payload, the signature will no longer match the payload when verified with the server's secret, resulting in a `401 Unauthorized`.
