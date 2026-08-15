# Profile Management

The EcivreS system requires authenticated users to establish a profile (either `CustomerProfile` or `ProviderProfile`) before accessing core business functionality.

## Flow
1. User registers and obtains a JWT token.
2. The Mobile App restores the session by calling `GET /users/me`.
3. The backend returns user data, including boolean flags `hasCustomerProfile` and `hasProviderProfile`.
4. If neither profile exists, the Mobile App routes the user to `ProfileSetupNavigator`.
5. The user completes the specific profile form (`CustomerProfileSetupScreen` or `ProviderProfileSetupScreen`).
6. The profile is created on the backend (e.g. `POST /customers/profile`), which automatically grants them the corresponding role (`CUSTOMER` or `PROVIDER`).
7. The Mobile App refetches `/users/me` and updates global Zustand state, routing the user into the main application.

## Ownership and IDOR Prevention
Endpoints for managing profiles (`GET`, `POST`, `PATCH`) under `/customers/profile` and `/providers/profile` use the authenticated `userId` from the JWT token via the `@CurrentUser()` decorator. They do not accept target `userId`s in the URL parameter or request body, entirely preventing Insecure Direct Object Reference (IDOR) attacks. Users can only fetch and update their own profile.
