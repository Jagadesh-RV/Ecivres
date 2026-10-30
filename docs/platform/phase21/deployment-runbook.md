# Phase 21 Production Deployment Runbook

## 1. Pre-Deployment Readiness Checklist
- [x] Monorepo TypeScript check (`pnpm -r run typecheck`) passes with 0 errors across 9 workspaces.
- [x] Phase 21 test suite (`pnpm --filter api test ecosystem.spec.ts`) passes with 29/29 tests.
- [x] Phase 20 regression suite (`pnpm --filter api test governance-compliance.spec.ts`) passes with 19/19 tests.
- [x] Phase 19 regression suite (`pnpm --filter api test trust-resilience.spec.ts`) passes with 17/17 tests.
- [x] Phase 18 regression suite (`pnpm --filter api test closed-loop.spec.ts`) passes with 21/21 tests.
- [x] API production build (`nest build`) succeeds.
- [x] Web frontend build (`next build`) compiles all 37 dynamic/static routes cleanly.

## 2. Production Rollout Execution
1. Fetch latest changes and merge to `main`:
   ```bash
   git checkout main
   git pull origin main
   git merge develop
   ```
2. Build workspace artifacts:
   ```bash
   pnpm install --frozen-lockfile
   pnpm --filter api exec prisma generate
   pnpm --filter api exec prisma migrate deploy
   pnpm -r run build
   ```
3. Verify live endpoints:
   ```bash
   curl -f http://localhost:4000/api/v1/ecosystem/integrations/health
   curl -f http://localhost:4000/api/v1/ecosystem/regions
   ```
