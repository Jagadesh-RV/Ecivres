# Operational Runbook — Database Recovery & Failover

## Symptoms
- Connection pool timeout (`P2024`) or read-only replica failover errors.

## Mitigation Steps
1. Verify AWS RDS primary instance health.
2. Trigger AWS Route53 / RDS Multi-AZ automated failover.
3. Reset Prisma connection pool size via environment configuration.
