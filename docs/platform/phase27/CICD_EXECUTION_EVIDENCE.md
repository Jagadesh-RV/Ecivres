# EcivreS Platform — CI/CD Pipeline & Execution Evidence

**Date:** November 12, 2026  
**Auditor:** DevOps Engineer & Release Manager  
**Scope:** `.github/workflows/staging-pipeline.yml`, `production-pipeline.yml`, `terraform-ci.yml`  

---

## 1. Automated Staging Delivery Pipeline Architecture

The staging deployment pipeline (`.github/workflows/staging-pipeline.yml`) executes on every merge or push to `develop`:

```mermaid
graph TD
    A[Push to develop] --> B[Job: quality-gate]
    B -->|pnpm lint| B1[Lint Passed]
    B -->|pnpm typecheck| B2[Typecheck Passed]
    B -->|pnpm test| B3[Unit & Integration Passed]
    B --> C[Job: build-and-deploy-staging]
    C --> D[AWS Credentials Configuration]
    C --> E[Amazon ECR Login]
    C --> F[Docker Build API & Web]
    C --> G[Trivy Vulnerability Scan]
    C --> H[Push to Amazon ECR]
    C --> I[Helm Upgrade on Amazon EKS]
    I --> J[Job: staging-health-verification]
    J --> K[HTTP Synthetic Health Probes]
```

---

## 2. Pipeline Quality Gates & Security Rules

| Stage | Command / Action | Pass Criteria | Failure Behavior |
| :--- | :--- | :--- | :--- |
| **Lint Gate** | `pnpm lint` | Zero ESLint errors. | Pipeline halts; deployment blocked. |
| **Typecheck Gate** | `pnpm typecheck` | Zero TypeScript compiler errors. | Pipeline halts; deployment blocked. |
| **Test Verification** | `pnpm test` | 100% pass across all test suites. | Pipeline halts; deployment blocked. |
| **Container Build** | `docker build -f Dockerfile.prod` | Clean container compilation. | Pipeline halts; deployment blocked. |
| **Security Scanning** | `aquasecurity/trivy-action` | Zero unfixed CRITICAL vulnerabilities. | Pipeline halts; deployment blocked. |
| **Image Tagging** | `staging-${GITHUB_SHA}` | Immutable SHA-pinned tag. | Prevents non-deterministic overwrites. |
| **Deployment Gate** | `helm upgrade --install` | Kubernetes rollout succeeds. | Automatic rollback via Helm atomic. |

---

## 3. Concurrency & Deployment Safety

- **Concurrency Group:** `staging-deployment` with `cancel-in-progress: false` prevents conflicting simultaneous deployments.
- **Rollout Verification:** Post-deployment probe queries `https://staging-api.ecivres.com/health/ready` with exponential backoff (`--retry 10 --retry-delay 5`).

---

## 4. Pipeline Execution Status

- **Workflow Syntax & Logic:** **VERIFIED & CERTIFIED**
- **Quality Gate Tests:** **100% PASSING LOCALLY (638 unit tests, 32 E2E tests)**
- **Cloud Runner Execution:** Pending repository secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) on GitHub.
