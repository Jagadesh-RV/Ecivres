# EcivreS Platform — Deployment Safety & Rollback Readiness Specification

**Phase:** Phase 23 — Autonomous Reliability, Self-Healing Infrastructure & Operational Excellence  
**Version:** `15.0.0`  
**Status:** Approved & Implemented

---

## 1. Deployment Safety Framework

To ensure zero-downtime releases and eliminate regression risks during production rollouts, EcivreS follows a multi-tier deployment safety model:

1. **Pre-Deployment Validation Gates:**
   - Full monorepo type checking: `pnpm -r run typecheck`.
   - Comprehensive test suite execution (Unit, Integration, and Regression suites across all past phases).
   - Zero additive schema breaking changes (Prisma schema forward-compatible).
2. **Kubernetes Health Probing:**
   - **Liveness Probe:** `GET /health/live` (initial delay: 10s, period: 10s, timeout: 2s).
   - **Readiness Probe:** `GET /health/ready` (initial delay: 5s, period: 5s, timeout: 2s).
3. **Graceful Draining & Zero-Drop Rollouts:**
   - Managed by `GracefulShutdownService`.
   - On receiving `SIGTERM`, pods stop accepting new traffic, finish in-flight requests within a 10s drain window, and disconnect Prisma pools cleanly before termination.

---

## 2. Backward-Compatible Database Migration Rules

The platform strictly enforces the **Expand-and-Contract** pattern for all schema updates:

- **Expand Phase (Current Phase):**
  - Additive columns with `@default(...)` or optional types (`?`).
  - Additive tables (`ServiceLevelObjectiveRecord`, `SelfHealingExecutionAudit`).
  - Old and new application versions run concurrently against the same database schema without exceptions.
- **Contract Phase (Future Phase):**
  - Deprecated columns or models are only removed after all older application pods have been replaced and code references removed.
- **Prohibited in Production:**
  - Renaming columns directly.
  - Adding non-null columns without default values.
  - Dropping tables or constraints during active business hours.

---

## 3. Rollback Procedures & Decision Criteria

### 3.1 Automated Rollback Triggers
A rollback is recommended or automatically initiated if within 15 minutes of deployment:
- HTTP 5xx error rate spikes above $1.0\%$.
- Kubernetes readiness probe fails for $> 3$ consecutive evaluation periods on new pods.
- SLO error budget burn rate exceeds $5.0\text{x}$ on critical workflows (`booking_lifecycle`, `payment_processing`).

### 3.2 Kubernetes Rollback Command
```bash
# Roll back API deployment to previous revision
kubectl rollout undo deployment/ecivres-api -n production

# Verify rollback progression
kubectl rollout status deployment/ecivres-api -n production
```

### 3.3 Database Rollback Strategy
Because schema changes in Phase 23 are strictly additive (`ServiceLevelObjectiveRecord` and `SelfHealingExecutionAudit`), rolling back the application container does **not** require rolling back database schema, preventing catastrophic data loss or migration locking.
