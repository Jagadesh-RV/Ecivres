# Access and Refresh Token Flow

## Why do we need two tokens?
- **Access Tokens** grant access to the API but have a very short lifespan (e.g., 15 minutes). If stolen, the attacker only has access for a short window.
- **Refresh Tokens** have a long lifespan (e.g., 7 days) but can *only* be used to request new Access Tokens. If a user's session needs to be revoked, we delete the Refresh Token from the database.

## Complete Access Token Flow

```mermaid
sequenceDiagram
    participant App as Mobile App (Axios)
    participant Auth as Auth Store (Zustand)
    participant API as NestJS Backend
    
    App->>API: GET /api/v1/users/me (No Token)
    API-->>App: 401 Unauthorized
    
    Auth->>App: Inject Token (Bearer eyJ...)
    App->>API: GET /api/v1/users/me (With Token)
    API-->>App: 200 OK (User Data)
```

1. The mobile app stores the token in `AsyncStorage`.
2. The `apiClient` (`apps/mobile/src/services/api/interceptors.ts`) intercepts every outgoing request and injects the `Authorization` header.
3. The NestJS `JwtAuthGuard` validates the token.

## Complete Refresh Token Flow

Refresh tokens are stored as **bcrypt hashes** in the PostgreSQL database (`RefreshToken` model). This prevents attackers from stealing usable tokens even if the database is compromised.

```mermaid
sequenceDiagram
    participant App as Mobile App
    participant Interceptor as Axios Interceptor
    participant API as NestJS Backend
    participant DB as PostgreSQL
    
    App->>API: GET /users/me (Expired Access Token)
    API-->>Interceptor: 401 Unauthorized
    
    Interceptor->>API: POST /auth/refresh (Refresh Token)
    API->>DB: Find RefreshToken record
    API->>API: bcrypt.compare()
    API->>DB: Delete old token (Rotation)
    API->>DB: Create new token
    API-->>Interceptor: New Access + Refresh Token
    
    Interceptor->>App: Store new tokens
    Interceptor->>API: Retry GET /users/me (New Access Token)
    API-->>App: 200 OK
```

### Refresh Token Revocation
When a user logs out (`/auth/logout`), the backend finds their specific refresh token hash in the database and deletes it. This immediately kills their long-term session.

### "Not Verified" Notice
*Note: In the current backend implementation (`auth.service.ts`), token rotation strictly revokes the single token used for the refresh request. We do not currently implement "Refresh Token Reuse Detection" (revoking the entire token family if a reused token is detected).*
