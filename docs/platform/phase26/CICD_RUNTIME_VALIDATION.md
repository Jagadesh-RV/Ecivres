# EcivreS Platform — CI/CD Pipeline Verification & Delivery Flows

**Date:** November 10, 2026  
**Auditor:** Senior DevOps Engineer  

---

## 1. Verified Workflow Inventory

| Workflow File | Target Branch | Purpose | Quality & Security Controls |
| :--- | :--- | :--- | :--- |
| **`ci.yml`** | PR to `main`, `develop` | Pull Request Quality Gate | Lint, Typecheck, Unit/Integration tests, Build |
| **`staging-pipeline.yml`** | Push to `develop` | Staging Image Build & Rollout | Trivy Vulnerability Scan, ECR push, EKS Helm deploy, curl smoke probe |
| **`production-pipeline.yml`** | Push to `main` | Production Deployment Gate | Trivy scan, Immutable SHA tagging, Helm rolling update |
| **`terraform-ci.yml`** | Push to `terraform/**` | IaC Validation | `terraform fmt`, `terraform validate` across staging & prod |
| **`security-scan.yml`** | Scheduled / On-Demand | Vulnerability Audit | CodeQL, Dependency audit, secret scan |

---

## 2. Staging Delivery Pipeline Details (`staging-pipeline.yml`)

The staging deployment pipeline consists of three sequential jobs:
1. **`quality-gate`**:
   - `pnpm install --frozen-lockfile`
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm test`
2. **`build-and-deploy-staging`**:
   - Authenticates via AWS OIDC/Credentials
   - Builds `ecivres-api:staging-${GITHUB_SHA}` and `ecivres-web:staging-${GITHUB_SHA}`
   - Runs Aqua Security Trivy scan (`severity: 'CRITICAL,HIGH'`, `exit-code: '0'`, `ignore-unfixed: true`)
   - Pushes images to Amazon ECR
   - Deploys Helm chart to EKS `staging` namespace
3. **`staging-health-verification`**:
   - Probes `https://staging-api.ecivres.com/health/ready` with retries to confirm successful deployment.

---

## 3. Deployment Safety Standards

- **Traceability**: Every image tag is cryptographically linked to the Git commit SHA.
- **Least-Privilege**: Cloud actions use scoped IAM roles.
- **Approval Boundaries**: Feature branches are blocked from deploying directly to staging or production; deployments require merging into `develop` or `main`.
