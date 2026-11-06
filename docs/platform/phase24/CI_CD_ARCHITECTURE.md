# EcivreS Platform — CI/CD Pipeline & Continuous Delivery Specification

**Phase:** Phase 24 — Production Deployment, Cloud Infrastructure, DevSecOps & Continuous Delivery  
**Version:** `16.0.0`  
**Status:** Approved & Validated

---

## 1. Pipeline Architecture Overview

The EcivreS CI/CD pipeline enforces automated quality, security, and verification gates across the development lifecycle using GitHub Actions.

```
+---------------------------------------------------------------------------------------+
| 1. Pull Request Gate (Any PR to develop or main)                                      |
|    - Dependency Frozen Lockfile Install (pnpm 9+)                                    |
|    - Monorepo Code Quality & Linting (ESLint)                                         |
|    - Monorepo TypeScript Compilation (tsc --noEmit)                                   |
|    - Full Test Suite Execution (Unit, Integration, Regression across Phases 18-24)    |
|    - DevSecOps SAST Scanning (Semgrep OWASP Top 10)                                   |
|    - Secret Leakage Detection (Gitleaks)                                              |
|    - Dependency Vulnerability Audit (pnpm audit)                                      |
+---------------------------------------------------------------------------------------+
                                           |
                                           v [PR Approved & Merged]
+---------------------------------------------------------------------------------------+
| 2. Develop Branch Pipeline (Staging Delivery)                                         |
|    - Staging Container Image Build (Tagged with commit SHA)                           |
|    - Container Vulnerability Scan (Trivy CRITICAL/HIGH)                               |
|    - Automated Deploy to Staging Environment                                          |
|    - Bounded Smoke Test Verification (/health/ready probe)                            |
+---------------------------------------------------------------------------------------+
                                           |
                                           v [Integration Certified]
+---------------------------------------------------------------------------------------+
| 3. Main Branch Pipeline (Production Release)                                          |
|    - Manual Production Approval Gate                                                  |
|    - Immutable ECR Image Tagging (Tagged with commit SHA and release tag)             |
|    - Zero-Downtime Rolling Deployment (Helm / ECS Fargate)                            |
|    - Post-Deployment Health Verification Probe (/health/ready)                        |
|    - Automated Rollback Trigger if error rate > 1.0% or probe fails                   |
+---------------------------------------------------------------------------------------+
```

---

## 2. Policy Enforcements

1. **Prohibited Branch Rules:**
   - Triggers for `release/*` and `version/*` branches have been eliminated across all workflows in adherence to repository git restrictions.
   - Development occurs exclusively on feature branches merged sequentially: `feature` $\rightarrow$ `develop` $\rightarrow$ `main`.
2. **Least-Privilege Cloud IAM:**
   - GitHub Actions uses AWS OIDC role assumption (`aws-actions/configure-aws-credentials@v4`) avoiding long-lived static AWS access keys.
3. **Artifact Immutability:**
   - Container images are tagged with explicit git commit SHAs (`${{ github.sha }}`) and semantic release tags. Deploying unversioned `latest` tags to production is blocked.
