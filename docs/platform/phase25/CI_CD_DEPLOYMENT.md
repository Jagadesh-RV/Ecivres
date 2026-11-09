# EcivreS Platform — CI/CD Continuous Delivery Pipelines

## Overview

The EcivreS CI/CD platform is implemented using GitHub Actions workflows, designed with strict separation between feature integration, staging deployment, and production release gates.

---

## 1. Workflow Architecture Matrix

| Workflow File | Trigger Branch | Execution Purpose | Artifacts Produced | Security & Scan Controls |
| :--- | :--- | :--- | :--- | :--- |
| **`ci.yml`** | Pull Requests (`main`, `develop`) | Quality Gate (Lint, Typecheck, Test, Build) | None (ephemeral) | Lint rules, TypeScript strict check |
| **`staging-pipeline.yml`** | Push to `develop` | Staging Image Build & Deployment | `ecivres-api:staging-*`, `ecivres-web:staging-*` | Trivy CVE Scan, Immutable SHA tagging |
| **`production-pipeline.yml`** | Push to `main` | Production Release Gate & Deployment | `ecivres-api:${SHA}`, `ecivres-api:latest` | Trivy Scan, Non-root verification, Helm deployment |
| **`terraform-ci.yml`** | PR / Push on `terraform/**` | IaC Static Validation | Validated HCL | `terraform fmt -check`, `terraform validate` across staging & prod |
| **`security-scan.yml`** | Nightly / Weekly Schedule | Comprehensive DevSecOps Audit | Security Reports | Dependabot, CodeQL, Secret scanning |

---

## 2. Pipeline Stage Breakdown

### 2.1 Quality Gate (`quality-gate`)
- Checks out repository using `actions/checkout@v4`.
- Configures Node.js 22 and pnpm 9.
- Runs frozen lockfile installation: `pnpm install --frozen-lockfile`.
- Verifies code cleanliness: `pnpm lint`.
- Verifies strict static typing: `pnpm typecheck`.
- Runs full regression test suite: `pnpm test`.

### 2.2 Container Build & Vulnerability Gate (`build-and-deploy`)
- Authenticates securely to AWS using short-lived IAM credentials (`aws-actions/configure-aws-credentials@v4`).
- Logs into Amazon ECR (`aws-actions/amazon-ecr-login@v2`).
- Builds production container images using `apps/api/Dockerfile.prod` and `apps/web/Dockerfile.prod`.
- Executes Trivy vulnerability scanning:
  - Fails build if unfixed `CRITICAL` CVEs exist.
  - Generates vulnerability summary table.
- Pushes immutable SHA-tagged images to Amazon ECR.

### 2.3 Deployment & Verification Gate (`deploy`)
- Updates kubeconfig for the target EKS cluster:
  ```bash
  aws eks update-kubeconfig --name ecivres-eks-production --region us-east-1
  ```
- Executes Helm rolling upgrade with zero downtime:
  ```bash
  helm upgrade --install ecivres ./helm/ecivres \
    --namespace production \
    --set image.tag=${{ steps.meta.outputs.IMAGE_TAG }} \
    --set releaseDate="${{ steps.meta.outputs.RELEASE_DATE }}"
  ```
- Executes post-deployment smoke test probes against `/health/ready`.
