# EcivreS Platform — Database Schema & Migration Validation

## Overview

The EcivreS persistence layer is managed by Prisma ORM with PostgreSQL. This document details the schema topology, client generation, migration strategies, and production deployment safety rules.

---

## 1. Prisma Architecture & Schema Scope

- **Schema Location**: `apps/api/prisma/schema.prisma`
- **Schema Size**: 52,404 bytes
- **Prisma Client Version**: `v7.9.1`
- **Driver Adapter**: `@prisma/adapter-pg`

### Verified Core Domains:
1. **Identity & Access Management**: `User`, `Profile`, `CustomerProfile`, `ProviderProfile`, `AdminRole`, `AuditLog`, `SessionRecord`.
2. **Catalog & Discovery**: `ServiceCategory`, `ServiceOffering`, `ServicePricingTier`, `ServiceArea`, `Tag`.
3. **Commerce & Fulfillment**: `Booking`, `BookingItem`, `BookingStateHistory`, `PaymentRecord`, `EscrowHold`, `DisputeRecord`, `Review`.
4. **Autonomous Intelligence & Operations**: `OperationsIncident`, `ServiceLevelObjectiveRecord`, `SelfHealingExecutionAudit`, `AutonomousRecoveryAction`, `CircuitBreakerStateRecord`, `InboundWebhookEvent`.

---

## 2. Prisma Client Generation Evidence

Prisma Client generation was executed and verified:
```text
$ pnpm --filter api run db:generate
> api@0.0.1 db:generate
> prisma generate

Prisma schema loaded from prisma\schema.prisma.
✔ Generated Prisma Client (v7.9.1) in 957ms
Exit code: 0
```

---

## 3. Migration Deployment Strategy

### Production & Staging: `prisma migrate deploy`
In production and staging environments, migrations must always be applied via `prisma migrate deploy`:
- Reads committed SQL migration files from `prisma/migrations/`.
- Executes pending migrations within isolated transactional blocks.
- Never prompts for user confirmation.
- Never drops columns or modifies existing tables without explicit SQL rollback plans.
- Fails fast if schema drift is detected.

### Development: `prisma db push` / `prisma migrate dev`
During local feature development, `prisma db push` synchronizes the local PostgreSQL instance without generating unreviewed migration files. Once stable, `prisma migrate dev --name <change_name>` creates the committed migration file.

---

## 4. Database Safety Rules
1. **SSL Required**: In AWS RDS, SSL encryption is enforced (`rds.force_ssl=1`).
2. **Zero In-Memory Credential Leaks**: Database URLs are injected strictly via container environment variables (`DATABASE_URL`) from AWS Secrets Manager.
3. **Connection Pooling**: Node.js connection pool size is bounded (`max: 20` per container task) to prevent PostgreSQL connection saturation.
