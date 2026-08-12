# JWT

The JSON Web Token contains the user's `id` and `roles`.
- Access tokens are short-lived (e.g. 15 minutes) and must be included in the `Authorization` header (`Bearer <token>`).
- If an access token expires, the client uses the refresh token to get a new one.
