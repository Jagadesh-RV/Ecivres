# Authentication

Authentication relies on JSON Web Tokens (JWT).
- **Registration**: User provides details, password is hashed with bcrypt, user is stored in the database.
- **Login**: Verifies credentials, returns an `access_token` and a `refresh_token`.
- **Logout**: Clears tokens securely on the client and ideally revokes refresh tokens on the server.
