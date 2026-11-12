# EcivreS Platform — Blockers & Operator Handover Runbook

**Date:** November 12, 2026  
**Auditor:** Principal Cloud Architect & Release Manager  
**Scope:** Actionable Prerequisites for Live AWS Cloud Provisioning & Production Operations  

---

## 1. Executive Status of Release Gates

In accordance with Phase 27 Section 18 (*Final Acceptance Gates*), EcivreS has achieved:
- **SOURCE IMPLEMENTED:** Complete.
- **STATICALLY VALIDATED:** Complete.
- **LOCAL INTEGRATION VERIFIED:** Complete (196 unit suites, 7 E2E suites passing 100%).
- **CLOUD INFRASTRUCTURE PROVISIONED:** **BLOCKED (Strict Approval Gate)**.
- **STAGING DEPLOYED:** **BLOCKED (Pending EKS Cluster Provisioning)**.

---

## 2. Itemized Blockers & Operator Action Items

### Blocker 1: AWS Cloud Credentials & Approval Gate
- **Status:** **BLOCKED**
- **Impact:** `terraform apply` and live EKS cluster provisioning cannot execute automatically.
- **Root Cause:** In strict compliance with Section 4, paid cloud resources (\$120–\$160/mo) are never created without explicit human approval. Furthermore, the AWS CLI is not installed in this environment.
- **Operator Action Required:**
  1. Install the official AWS CLI v2:
     ```powershell
     msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi /quiet
     ```
  2. Configure staging IAM credentials with appropriate least-privilege policies:
     ```powershell
     aws configure --profile ecivres-staging
     ```
  3. Populate repository secrets in GitHub (`Settings -> Secrets and variables -> Actions`):
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`
  4. Execute plan review and approve infrastructure rollout:
     ```bash
     cd terraform/environments/staging
     terraform init
     terraform plan -out=staging.tfplan
     # Review plan, then approve:
     terraform apply staging.tfplan
     ```

---

### Blocker 2: Docker Desktop Engine on Local Host
- **Status:** **BLOCKED (Service Stopped)**
- **Impact:** `docker build` and `docker compose up` cannot connect to Docker named pipe (`//./pipe/docker_engine`).
- **Root Cause:** Docker Desktop Service is stopped and requires elevated Administrator permissions to start.
- **Operator Action Required:**
  - Launch Docker Desktop from the Windows Start menu or run PowerShell as Administrator:
    ```powershell
    Start-Service com.docker.service
    ```

---

### Blocker 3: Mobile Store Beta Distribution
- **Status:** **HELD BY POLICY**
- **Impact:** React Native iOS/Android builds have not been submitted to Apple TestFlight or Google Play Internal Track.
- **Root Cause:** Requires signed distribution certificates and developer account enrollment.
- **Operator Action Required:**
  - Provide Fastlane credentials (`APP_STORE_CONNECT_API_KEY`, `PLAY_STORE_JSON_KEY`) when mobile beta distribution is scheduled.
