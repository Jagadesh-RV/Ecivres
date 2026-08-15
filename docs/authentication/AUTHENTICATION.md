# Authentication System

## Overview
EcivreS uses JWT (JSON Web Tokens) for authenticating API requests. The authentication system is built using NestJS, Passport, and bcrypt.

## Flow
1. **Registration**: 
   - User provides `name`, `email`, and `password`.
   - `AuthService` hashes the password using `bcrypt` and stores the user in the database via Prisma.
   - A `CustomerProfile` is created for the new user automatically.
   - A JWT pair (access token) is generated and returned.

2. **Login**:
   - User provides `email` and `password`.
   - `AuthService` verifies the password against the stored bcrypt hash.
   - A JWT pair is generated and returned.

3. **Token Usage**:
   - The Mobile App stores the `access_token` securely in `AsyncStorage`.
   - The `requestInterceptor` in the Mobile App automatically attaches `Authorization: Bearer <token>` to all API requests.

4. **Token Refresh**:
   - The Mobile App detects 401 Unauthorized responses.
   - The `errorInterceptor` pauses all outgoing requests, attempts to fetch a new token from `/auth/refresh` using the `refresh_token`.
   - Upon success, it updates the stored token and resumes paused requests.
   - Upon failure, the user is logged out automatically.

## Security
- Passwords are never stored in plain text.
- JWT secret is loaded from `process.env.JWT_ACCESS_SECRET`.
- Future enhancement: Store refresh tokens in the database to allow revoking sessions remotely.
