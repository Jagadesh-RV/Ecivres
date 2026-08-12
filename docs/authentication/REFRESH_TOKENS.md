# Refresh Tokens

Refresh tokens are long-lived tokens securely stored in the database.
When a mobile client's access token expires, the client sends the refresh token to the `/api/v1/auth/refresh` endpoint to receive a new pair of tokens.
