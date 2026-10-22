# Phase 18 Runbook — Emergency Kill Switch Procedures

## 1. Scope & Authority
The Emergency Kill Switch (`KillSwitchService`) halts autonomous decision execution instantly across multiple isolation boundaries.

### Authorization:
- Global Kill Switch: Requires `SUPER_ADMIN` or Platform Director authorization.
- Tenant / Agent / Action / Experiment Kill Switch: Requires `TENANT_ADMIN` or authorized on-call SRE.

---

## 2. Emergency Triggering Procedures

### 2.1 Trigger via REST API
```bash
# Global Emergency Kill Switch
curl -X POST https://api.ecivres.local/api/v1/autonomous/closed-loop/kill-switch \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "scope": "GLOBAL",
    "reason": "Marketplace surge pricing anomaly detected across all zones",
    "activatedBy": "sre-lead@ecivres.com"
  }'

# Specific Action Kill Switch
curl -X POST https://api.ecivres.local/api/v1/autonomous/closed-loop/kill-switch \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "scope": "ACTION",
    "target": "PROVIDER_INCENTIVE_PAYOUT",
    "reason": "Suspected duplicate payout bug in upstream bank integration",
    "activatedBy": "finance-ops@ecivres.com"
  }'
```

---

## 3. Immediate System Behaviors Upon Activation
1. **In-Flight Executions**: Existing in-flight requests that have already passed validation are allowed to conclude or are reverted via compensation according to safety classification.
2. **Pending Decisions**: All new proposals transition to `CANCELLED`.
3. **Queue Ingestion**: Closed-loop execution worker queues immediately reject autonomous action payloads.
4. **Audit Trail**: Generates an immutable `KillSwitchEvent` record.
5. **Observability**: Fires high-priority alerts to PagerDuty and the Executive Command Center.

---

## 4. Deactivation & Restoration
1. Verify root cause remediation in staging/canary.
2. Review audit logs to verify zero stuck transactions.
3. Issue deactivation call with recorded justification:
```bash
curl -X POST https://api.ecivres.local/api/v1/autonomous/closed-loop/kill-switch/deactivate \
  -H "Authorization: Bearer $SUPER_ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "scope": "GLOBAL",
    "reason": "Hotfix deployed and verified on canary node",
    "deactivatedBy": "sre-lead@ecivres.com"
  }'
```
