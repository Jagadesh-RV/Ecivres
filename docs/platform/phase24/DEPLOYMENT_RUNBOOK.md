# EcivreS Platform — Production Deployment Runbook

**Phase:** Phase 24 — Production Deployment, Cloud Infrastructure, DevSecOps & Continuous Delivery  
**Version:** `16.0.0`  
**Status:** Approved & Validated

---

## 1. Pre-Deployment Checklist

Before triggering a production release:
- [ ] Feature branch merged to `develop`, staging smoke tests verified.
- [ ] Full regression suite passing (107/107 tests across Phases 18–24).
- [ ] Monorepo typecheck passing with zero errors (`pnpm typecheck`).
- [ ] Database changes reviewed for backward-compatibility (Expand-and-Contract).
- [ ] Error budgets across critical workflows in `HEALTHY` state ($>50\%$ remaining).

---

## 2. Release Execution Workflow

### Step 1: Merge to `main`
Create and merge pull request from `develop` into `main` after required code reviews:
```bash
git checkout main
git pull origin main
git merge --no-ff develop -m "chore(release): merge develop into main for release v16.0.0"
git push origin main
```

### Step 2: Automated Pipeline Execution
GitHub Actions triggers `.github/workflows/production-pipeline.yml`:
1. Executes quality gates (Lint, Typecheck, Test, Dependency Audit).
2. Builds immutable multi-stage container images (`ecivres-api`, `ecivres-web`).
3. Scans container image with Trivy.
4. Pushes images to Amazon ECR.
5. Initiates zero-downtime rolling update on ECS Fargate / EKS.

### Step 3: Post-Deployment Smoke Test
Verify container health probes:
```bash
# Check liveness probe
curl -f https://api.ecivres.com/api/v1/health/live

# Check readiness probe (verifies database & dependency connectivity)
curl -f https://api.ecivres.com/api/v1/health/ready
```

### Step 4: Tag Release
```bash
git tag -a v16.0.0-production-cloud-infrastructure-devsecops -m "Release v16.0.0"
git push origin v16.0.0-production-cloud-infrastructure-devsecops
```
