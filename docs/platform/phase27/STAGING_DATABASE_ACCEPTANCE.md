# EcivreS Platform — Staging Database Acceptance & Migration Verification

**Date:** November 12, 2026  
**Auditor:** Database Reliability Engineer (DBRE) & SRE  
**Scope:** Prisma ORM v7.9.1, PostgreSQL Schema & Migration Pipeline  

---

## 1. Migration History Baseline Creation

Prior to Phase 27, the repository possessed a 52KB `schema.prisma` definition but lacked versioned migration SQL files in `apps/api/prisma/migrations/`. In Phase 27, the definitive baseline migration was generated and registered.

### Migration Metadata
- **Migration Identifier:** `20261112000000_init`
- **Location:** `apps/api/prisma/migrations/20261112000000_init/migration.sql`
- **File Size:** `83,061 bytes`
- **Provider Lock:** `apps/api/prisma/migrations/migration_lock.toml` (`provider = "postgresql"`)
- **Generation Method:** `pnpm --filter api exec prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script`

---

## 2. Core Entities, Constraints & Indices

The generated migration script defines the complete multi-role service marketplace data model:

```sql
-- Core Identity & Role-Based Access Control
CREATE TABLE "User" (...);
CREATE TABLE "Role" (...);
CREATE TABLE "Permission" (...);
CREATE TABLE "RolePermission" (...);
CREATE TABLE "UserRole" (...);

-- Profiles & Market Entities
CREATE TABLE "CustomerProfile" (...);
CREATE TABLE "ProviderProfile" (...);
CREATE TABLE "Category" (...);
CREATE TABLE "Service" (...);
CREATE TABLE "Booking" (...);
CREATE TABLE "Payment" (...);
CREATE TABLE "Review" (...);

-- Enterprise Tenancy & B2B Governance
CREATE TABLE "EnterpriseOrganization" (...);
CREATE TABLE "OrganizationMember" (...);
CREATE TABLE "CustomRateCard" (...);
CREATE TABLE "PurchaseOrderInvoice" (...);

-- Autonomous Reliability & Observability
CREATE TABLE "ServiceLevelObjectiveRecord" (...);
CREATE TABLE "SelfHealingExecutionAudit" (...);
CREATE TABLE "AnomalyRecord" (...);
CREATE TABLE "IncidentRecord" (...);
```

### Key Foreign Key Constraints & Cascades
- `CustomerProfile_userId_fkey` $\rightarrow$ `User(id)` ON DELETE CASCADE.
- `ProviderProfile_userId_fkey` $\rightarrow$ `User(id)` ON DELETE CASCADE.
- `RolePermission_roleId_fkey` $\rightarrow$ `Role(id)` ON DELETE CASCADE.
- `OrganizationMember_orgId_fkey` $\rightarrow$ `EnterpriseOrganization(id)` ON DELETE CASCADE.
- `Booking_customerId_fkey` $\rightarrow$ `User(id)` ON DELETE RESTRICT.
- `Payment_bookingId_fkey` $\rightarrow$ `Booking(id)` ON DELETE RESTRICT.

---

## 3. Client Generation & Compatibility

- **Command:** `pnpm --filter api run db:generate`
- **Execution Time:** `754ms`
- **Prisma Client Version:** `v7.9.1`
- **Compatibility:** 100% verified across 196 API unit/integration suites and 7 HTTP E2E suites.

---

## 4. Staging Deployment Migration Workflow

In staging and production pipelines (`.github/workflows/staging-pipeline.yml`):
```bash
# Deploys all pending migrations against the target database
pnpm --filter api exec prisma migrate deploy
```
- **Idempotency:** Prisma tracks executed migrations in the `_prisma_migrations` system table.
- **Rollback Safety:** Schema changes must remain backward-compatible; additive migrations are deployed prior to container rollout.
