# Authentication Architecture

EcivreS uses a robust JWT-based authentication system spanning both the NestJS API and the React Native mobile application.

## Backend Implementation

The backend (`apps/api`) implements secure token issuance and rotation:

1. **Registration/Login**: Passwords are securely hashed using `bcrypt`. Successful authentication returns an `access_token` and a `refresh_token`.
2. **Access Token**: A short-lived JWT that contains the user's ID (`sub`) and `email`. Used for Bearer authentication on protected endpoints.
3. **Refresh Token**: A cryptographically random string, stored securely via a salted hash in the database (`RefreshToken` model) mapped to the user ID. Used to rotate and obtain a new access token without re-authenticating. Prevents token replay through strict deletion upon use.
4. **Current User**: A protected `/users/me` endpoint returns safe user profile data mapped with active roles.

## Mobile Implementation

The mobile app (`apps/mobile`) integrates via a secure Axios configuration and Zustand state:

1. **Secure Storage**: Tokens are stored via `react-native-keychain`, ensuring encryption at rest on both iOS and Android.
2. **Interceptors**: Axios interceptors automatically inject the `access_token` into protected requests.
3. **Automatic Refresh**: A 401 Unauthorized response triggers a queueing interceptor which calls `/auth/refresh`, updates the secure tokens, and seamlessly replays the queued requests.
4. **State Management**: The Zustand `authStore` manages the user session, loading state, and role profiles to drive the `AppNavigator` routing accurately.
5. **Forgot Password**: The Forgot Password screen is present but marked as Not Yet Available until a secure email reset flow is configured on the backend.
