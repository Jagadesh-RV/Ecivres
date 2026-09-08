# API Performance Response Time SLAs & Database Indexing Specification

## Service Level Agreements (SLAs)
- **p95 Latency Target**: < 150ms
- **p99 Latency Target**: < 400ms
- **Slow Query Logging Threshold**: > 500ms (logged via `PerformanceInterceptor`)

## Database Indexing Strategy
- `Booking(customerId, scheduledAt)`
- `Booking(serviceId, status)`
- `Service(providerId, categoryId)`
- `RefreshToken(userId, expiresAt)`
