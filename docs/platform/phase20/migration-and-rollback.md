# Phase 20 Migration & Rollback Runbook

## 1. Database Schema Changes
Phase 20 introduces 6 new non-breaking additive models to `apps/api/prisma/schema.prisma`:
1. `MarketplacePolicy`
2. `ImmutableAuditLog`
3. `EnterpriseOrganization`
4. `OrganizationMember`
5. `DataPrivacyRequest`
6. `DataRetentionPolicy`

All existing tables, relationships, and indexes from Phases 1–19 remain completely untouched.

## 2. Forward Migration
1. Validate Prisma schema:
   ```bash
   pnpm --filter api exec prisma validate
   ```
2. Generate Prisma client:
   ```bash
   pnpm --filter api exec prisma generate
   ```
3. Deploy migrations to target PostgreSQL database:
   ```bash
   pnpm --filter api exec prisma migrate deploy
   ```

## 3. Rollback Procedure
If rollback of Phase 20 models is required:
1. Stop API traffic to `/api/v1/governance/*` endpoints.
2. In the PostgreSQL database, drop the 6 new tables:
   ```sql
   DROP TABLE IF EXISTS "DataRetentionPolicy" CASCADE;
   DROP TABLE IF EXISTS "DataPrivacyRequest" CASCADE;
   DROP TABLE IF EXISTS "OrganizationMember" CASCADE;
   DROP TABLE IF EXISTS "EnterpriseOrganization" CASCADE;
   DROP TABLE IF EXISTS "ImmutableAuditLog" CASCADE;
   DROP TABLE IF EXISTS "MarketplacePolicy" CASCADE;
   ```
3. Revert API deployment to Phase 19 baseline tag `v11.0.0-autonomous-marketplace-trust-resilience-scale`.
