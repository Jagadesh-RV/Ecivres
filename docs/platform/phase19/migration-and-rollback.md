# Phase 19 — Migration & Rollback Guide

## 1. Database Schema Changes
Phase 19 introduced four new non-breaking models in `apps/api/prisma/schema.prisma`:
1. `MarketplaceTrustIncident`
2. `DecisionExplanationRecord`
3. `CircuitBreakerStateRecord`
4. `SelfHealingLoopBreakerRecord`

All models include indexed multi-tenant fields (`tenantId`) and default values ensuring complete backward compatibility with existing data rows.

---

## 2. Forward Migration
Apply migrations and regenerate client:
```bash
pnpm --filter api exec prisma generate
```

---

## 3. Rollback Procedure
If a production issue necessitates reverting Phase 19:
1. Trigger Global Emergency Kill Switch via `POST /api/v1/autonomous/closed-loop/kill-switch`.
2. Deploy previous container release tag `v10.0.0-autonomous-marketplace-evolution`.
3. Existing Phase 18 closed-loop tables remain untouched and fully operational.
