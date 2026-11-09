# EcivreS Platform — End-to-End Application & Platform Testing

## Overview

Phase 25 establishes a comprehensive End-to-End (E2E) testing suite that validates the full multi-role service marketplace lifecycle, resilience probes, operational SLO tracking, autonomous self-healing, and environment security guards.

---

## 1. Test Suite Architecture (`e2e-deployment.spec.ts`)

Located at: `apps/api/src/modules/reliability/e2e-deployment.spec.ts`

### Test Sections & Coverage:

### 1. Production & Staging Health Probe Verification
- **Liveness Probe**: Verifies `checkLiveness()` returns HTTP 200 equivalent `status: "UP"`, process uptime, and timestamp.
- **Readiness Probe**: Verifies `checkReadiness()` returns `status: "READY"` when PostgreSQL and Redis are responsive.
- **Dependency Fault Isolation**: Simulates a 3000ms database query timeout; verifies system transitions to `status: "NOT_READY"` and reports `checks.database.status: "UNAVAILABLE"` without process crash.
- **Deep Dependency Report & Credential Redaction**: Validates that all connection strings, cleartext passwords, and internal IPs are redacted from deep diagnostic payloads.

### 2. Multi-Role Marketplace Lifecycle Simulation
- **Step 1: User Onboarding & Identity Provisioning**: Registers Customer (`usr_cust_staging_001`) and Provider (`usr_prov_staging_002`) with verified RBAC roles.
- **Step 2: Service Catalog Registration**: Provider publishes service `srv_panel_upgrade` under category `electrical-engineering` with pricing of $250.00.
- **Step 3: Dynamic Booking Initiation & State Machine Transitions**:
  - Initiates booking (`PENDING`).
  - Provider confirms schedule (`CONFIRMED`).
  - Provider begins on-site work (`IN_PROGRESS`).
  - Provider completes work (`COMPLETED`).
- **Step 4: Escrow Payment Authorization & Settlement**:
  - Captures $250.00 payment.
  - Automatically calculates 10% platform fee ($25.00).
  - Releases provider net payout ($225.00).
- **Step 5: Customer Review & Rating**: Customer submits 5-star rating and verification review.

### 3. Operational SLOs, Fault Injection & Self-Healing
- **SLO Event Tracking**: Records nominal request latencies (120ms, 140ms); verifies 100% availability and `budgetStatus: "HEALTHY"`.
- **Self-Healing Execution**: Safely triggers `REDRIVE_DEAD_LETTER_WEBHOOKS` action with audit logging.
- **Incident Lifecycle Management**: Creates SEV2 incident (`PostgreSQL staging replication latency`), assigns runbook URL, and transitions to `status: "RESOLVED"`.

### 4. Environment Security & Secret Governance Assertion
- **Startup Protection**: Confirms application startup throws `[DEVSECOPS CRITICAL]` when placeholder development secrets (`super_secret_access_token_key_change_in_prod`) are detected in `NODE_ENV=production`.
- **Valid Credentials**: Confirms high-entropy cryptographic keys pass validation cleanly.

---

## 2. Test Execution Evidence

```text
$ pnpm --filter api test src/modules/reliability/e2e-deployment.spec.ts
PASS src/modules/reliability/e2e-deployment.spec.ts
  Phase 25: Staging & Production Deployment E2E Lifecycle Verification
    1. Production & Staging Health Probe Verification
      √ should return PASS for liveness probe when application is online (4 ms)
      √ should return READY and 200 OK equivalent when database and cache dependencies are responsive (1 ms)
      √ should correctly diagnose and isolate database connectivity failures (3 ms)
      √ should report deep dependency status with credential redaction (2 ms)
    2. End-to-End Multi-Role Marketplace Lifecycle Simulation
      √ Step 1: User Onboarding & Identity Provisioning (1 ms)
      √ Step 2: Marketplace Category and Service Offering Registration
      √ Step 3: Dynamic Booking Initiation & State Machine Progression (1 ms)
      √ Step 4: Escrow Payment Authorization, Settlement and Receipt (1 ms)
      √ Step 5: Customer Review & Rating Publication (1 ms)
    3. Operational SLOs, Fault Injection & Self-Healing
      √ should track nominal workflow events and calculate burn rate (2 ms)
      √ should trigger self-healing dead-letter webhook redrive safely (2 ms)
      √ should declare and resolve high-severity operations incidents (1 ms)
    4. Environment Security & Secret Governance Assertion
      √ should enforce production validation against missing critical secrets (22 ms)
      √ should accept properly configured production secrets

Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        2.959 s
Exit code: 0
```
