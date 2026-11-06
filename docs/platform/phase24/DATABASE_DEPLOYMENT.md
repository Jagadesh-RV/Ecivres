# EcivreS Platform — Database Production Readiness & Migration Strategy

**Phase:** Phase 24 — Production Deployment, Cloud Infrastructure, DevSecOps & Continuous Delivery  
**Version:** `16.0.0`  
**Status:** Approved & Validated

---

## 1. Production Database Architecture

- **Engine:** PostgreSQL 16 (AWS Aurora or Multi-AZ RDS).
- **ORM:** Prisma Client v7.9.1 (`@prisma/client` + `@prisma/adapter-pg`).
- **Connection Pooling:** PgBouncer connection pooler sitting in front of PostgreSQL to multiplex thousands of API client connections into a controlled set of backend database connections.
- **Connection Bounds:**
  - Prisma connection limit configured per pod: `connection_limit=10`.
  - Max client connections managed by PgBouncer: `max_client_conn=1000`.

---

## 2. Zero-Downtime Migration Rules (Expand-and-Contract)

To ensure that old and new application versions run concurrently during rolling rollouts without downtime:

1. **Phase 1: Expand (Forward-Compatible Additions):**
   - Additive tables (`ServiceLevelObjectiveRecord`, `SelfHealingExecutionAudit`).
   - Additive columns must be nullable or supply `@default(...)`.
   - Never rename or drop columns in the same release.
2. **Phase 2: Deploy New Application Code:**
   - Deploy new container pods reading from the new columns.
3. **Phase 3: Contract (Cleanup in Future Release):**
   - Deprecated columns are dropped only after all legacy pods have been decommissioned.

---

## 3. Production Migration Execution Protocol

In production CI/CD, schema changes are applied prior to container rollout using the dedicated Prisma migration engine:

```bash
# Execute pending backward-compatible migrations safely
pnpm --filter api exec prisma migrate deploy
```

> [!CAUTION]
> `prisma db push` is strictly prohibited in production environments as it can cause un-audited schema drift and data loss. Production changes must use versioned migration scripts.
