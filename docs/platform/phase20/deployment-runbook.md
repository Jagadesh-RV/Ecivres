# Phase 20 Deployment Runbook

## 1. Prerequisites
- Node.js $\ge$ 20.x
- pnpm $\ge$ 8.x
- PostgreSQL database accessible via `DATABASE_URL`

## 2. Pre-Deployment Verification Checklist
- [x] Monorepo TypeScript check (`pnpm -r run typecheck`) passes with 0 errors.
- [x] Phase 20 test suite (`pnpm --filter api test governance-compliance.spec.ts`) passes (19/19).
- [x] Regression test suites (Phase 18 closed-loop, Phase 19 trust-resilience) pass.
- [x] Working tree clean and intentional Git history.

## 3. Production Deployment Steps
1. Checkout target branch:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Install workspace dependencies:
   ```bash
   pnpm install --frozen-lockfile
   ```
3. Generate Prisma client & apply migrations:
   ```bash
   pnpm --filter api exec prisma generate
   pnpm --filter api exec prisma migrate deploy
   ```
4. Build API and Web workspaces:
   ```bash
   pnpm -r run build
   ```
5. Perform health check on running API:
   ```bash
   curl -f http://localhost:4000/api/health
   curl -f http://localhost:4000/api/v1/governance/audit/verify
   ```
