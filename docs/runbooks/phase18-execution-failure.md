# Phase 18 Runbook — Autonomous Execution Failure Triage & Compensation

## Overview
This runbook guides on-call engineers when an autonomous decision execution transitions to `FAILED`, `PARTIALLY_EXECUTED`, or encounters idempotency anomalies.

---

## 1. Triage Symptoms & Severity
- **Severity 1 (P1)**: Multiple executions failing concurrently on payment/financial actions (`PROVIDER_INCENTIVE_PAYOUT`, `CUSTOMER_RETENTION_CREDIT`).
- **Severity 2 (P2)**: Non-financial operational action failure rate > 5% over 15 minutes.
- **Severity 3 (P3)**: Isolated action failure with successful compensation rollback.

---

## 2. Immediate Diagnostic Procedure
1. **Locate Failed Execution**:
   Query failed executions via API:
   `GET /api/v1/autonomous/closed-loop/execution/:id`
2. **Inspect Error Message & Audit Record**:
   Check `errorMessage`, `actionType`, and `compensationPayload` in `ClosedLoopExecution`.
3. **Verify Idempotency Integrity**:
   Verify whether duplicate requests attempted to reuse the same `idempotencyKey`.

---

## 3. Remediation & Compensation Workflow
If an action partially executed and requires compensation:
```bash
curl -X POST https://api.ecivres.local/api/v1/autonomous/closed-loop/remediate \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "executionId": "exec_failed_id",
    "reason": "Manual operator triggered compensation following API timeout"
  }'
```
- If the action is marked `compensationSupported: true`, the system executes the inverse action automatically and transitions status to `COMPENSATED`.
- If marked non-reversible, escalate to Finance Operations for ledger adjustment.

---

## 4. Post-Incident Review
1. Ensure `DecisionEffectivenessLog` accurately records `executionStatus: FAILED`.
2. Confirm the failure signal is fed into `AgentPerformanceService` to prevent repeat proposals.
