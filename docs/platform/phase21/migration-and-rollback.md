# Phase 21 Migration & Rollback Runbook

## 1. Database Schema Additions
Phase 21 introduces 6 additive models to `apps/api/prisma/schema.prisma`:
1. `PartnerApiKey`
2. `ExternalIntegrationConfig`
3. `InboundWebhookEvent`
4. `MarketplaceRegion`
5. `ExchangeRateRecord`
6. `EcosystemIntelligenceSignal`

No existing tables, foreign keys, or indexes are modified or dropped.

## 2. Forward Migration Steps
```bash
pnpm --filter api exec prisma validate
pnpm --filter api exec prisma generate
pnpm --filter api exec prisma migrate deploy
```

## 3. Rollback Procedure
If rollback is triggered during production deployment:
1. Revert application deployment to baseline tag:
   ```bash
   git checkout v12.0.0-autonomous-marketplace-governance-compliance
   ```
2. Drop Phase 21 additive tables in PostgreSQL:
   ```sql
   DROP TABLE IF EXISTS "EcosystemIntelligenceSignal" CASCADE;
   DROP TABLE IF EXISTS "ExchangeRateRecord" CASCADE;
   DROP TABLE IF EXISTS "MarketplaceRegion" CASCADE;
   DROP TABLE IF EXISTS "InboundWebhookEvent" CASCADE;
   DROP TABLE IF EXISTS "ExternalIntegrationConfig" CASCADE;
   DROP TABLE IF EXISTS "PartnerApiKey" CASCADE;
   ```
3. Restart application containers and verify baseline `/api/health`.
