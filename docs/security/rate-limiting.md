# Rate Limiting & Throttling Specifications

## Global Throttling Limits
- **Short Tier**: 10 requests / 1 second
- **Medium Tier**: 50 requests / 10 seconds
- **Long Tier**: 100 requests / 60 seconds

## Strict Auth Throttling
- `/auth/login`: 5 requests / 60 seconds per IP
- `/auth/register`: 5 requests / 60 seconds per IP
- `/auth/forgot-password`: 3 requests / 60 seconds per IP
