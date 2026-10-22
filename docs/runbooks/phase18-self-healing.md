# Phase 18 Runbook — Self-Healing Operations & Remediation

## 1. Purpose
This runbook establishes operational guidance for the Phase 18 Self-Healing Engine (`SelfHealingService`), which autonomously remediates transient operational failures while strictly upholding safety boundaries.

---

## 2. Permitted Self-Healing Actions
The self-healing service is authorized to execute low-risk operational remediation:
1. **Dead-Letter Queue (DLQ) Reprocessing**: Retries failed notification or telemetry jobs with exponential backoff.
2. **Stale Cache Eviction**: Purges expired or desynchronized Redis cache keys for market vectors.
3. **Transient Job Restart**: Reschedules interrupted background simulation tasks.
4. **Connection Pool Reset**: Flushes stalled read-replica database pool connections.

---

## 3. Strict Prohibitions (Hard Security Boundaries)
Under NO circumstances is the autonomous engine permitted to:
- Modify user authentication credentials or session tokens.
- Alter RBAC permissions, user roles, or IAM policies.
- Disable fraud detection or rate-limiting filters.
- Reconfigure financial accounts, payout destinations, or bank settings.
- Delete production database records or tables.

Any attempt by an autonomous remediation trigger to execute prohibited actions will throw a `SecurityBoundaryViolation` and immediately notify Security Operations.

---

## 4. Operational Monitoring
- Review self-healing activity:
  `GET /api/v1/autonomous/closed-loop/self-healing/history?tenantId=...`
- Verify remediation success rate remains above 98.0%.
- Escalate any repeated self-healing failure (e.g. queue worker failing 3+ retries) to on-call platform engineers.
