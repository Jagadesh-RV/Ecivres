# Operational Runbook — Redis Cache & Sentinel Recovery

## Symptoms
- Session lookup delays or rate limiter failures.

## Mitigation Steps
1. Verify ElastiCache Redis cluster replication lag.
2. Promote Redis replica to primary if primary node fails.
3. Flush corrupted keys or restart Redis worker nodes safely.
