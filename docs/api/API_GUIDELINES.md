# API Guidelines

- All endpoints are prefixed with `/api/v1`.
- Requests should send JSON bodies.
- Successful responses return `{ data: ... }`.
- Error responses return `{ success: false, error: { code: string, message: string } }`.
