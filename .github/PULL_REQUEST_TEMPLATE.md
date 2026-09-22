## Summary
Short description of the proposed changes.

## Modules Changed
- [ ] API (`apps/api`)
- [ ] Web (`apps/web`)
- [ ] Mobile (`apps/mobile`)
- [ ] Database / Prisma (`prisma`)
- [ ] Documentation (`docs`)

## Verification Checklist
- [ ] `pnpm lint` passed
- [ ] `pnpm typecheck` passed (0 errors)
- [ ] `pnpm --filter api test` passed (100% test suite pass rate)
- [ ] `pnpm --filter web build` passed
- [ ] Mobile build verified
- [ ] Database migration tested & applied

## Security Checklist
- [ ] No API keys, tokens, or raw secrets committed
- [ ] No mock or placeholder responses in production paths
- [ ] No verbose debug logs or PII exposed
- [ ] Feature flags configured & tested
