# API Rate Limiting & Throttling Policy

## Overview
EcivreS API implements token bucket and sliding window rate limiting via NestJS ThrottlerGuard and Redis to protect services against burst abuse and credential stuffing attacks.

## Throttling Tiers
- **Short Tier**: 10 requests / 1 second window (prevents high-frequency automated polling).
- **Medium Tier**: 50 requests / 10 seconds window (burst allowance for UI navigation).
- **Long Tier**: 100 requests / 60 seconds window (sustained load quota).

## Rate Limit Response Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 98
X-RateLimit-Reset: 1789495000
```

When limits are exceeded, the API returns HTTP 429 `Too Many Requests`.
