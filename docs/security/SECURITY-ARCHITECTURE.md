# Security Architecture

## Current Security Implementations

EcivreS has established a solid baseline of security features in Phase 1 & 2:

1. **Password Hashing:** `bcrypt` with salt rounds of 10 is used. Passwords are never logged or stored in plain text.
2. **Stateless Authentication (JWT):** Access Tokens are short-lived. Refresh Tokens are stored as bcrypt hashes in the database.
3. **IDOR Prevention:** We rely heavily on `@CurrentUser()` to pull identity directly from the cryptographically signed JWT payload, ensuring users cannot manipulate IDs in request bodies to mutate other users' data.
4. **DTO Validation:** `class-validator` ensures all incoming payloads meet strict typing and formatting requirements before controller logic executes.
5. **CORS:** The NestJS API is configured with CORS enabled (currently accepting all origins in development).

## Recommended Future Hardening

To prepare the application for production, the following security enhancements are recommended:

- **Strict CORS Rules:** Limit CORS origins to the actual frontend domain, or disable if the API is strictly consumed by a Mobile App (which ignores CORS).
- **Rate Limiting:** Implement `@nestjs/throttler` to prevent brute-force login attacks on `/auth/login`.
- **Refresh Token Reuse Detection:** Invalidate all tokens associated with a user if an old, already-used refresh token is presented.
- **Secure Storage (Mobile):** Transition from `AsyncStorage` (which stores data in plain text on the device filesystem) to `Expo SecureStore` or `react-native-keychain` for encrypting JWTs on the device.
- **Helmet:** Use `helmet` middleware in NestJS to automatically set secure HTTP headers.
