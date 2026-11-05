# EcivreS Platform — Operational Runbooks & Emergency Procedures

**Phase:** Phase 23 — Autonomous Reliability, Self-Healing Infrastructure & Operational Excellence  
**Version:** `15.0.0`  
**Status:** Approved & Implemented

---

## <a id="general-incident-response"></a>1. General Incident Response Checklist

1. **Verify Impact:** Check `/health/ready` and `/reliability/metrics` to quantify error rate and affected workflows.
2. **Assign Incident Commander (IC):** Logged into incident channel (`#incident-active`).
3. **Record Incident:** Call `POST /reliability/incidents` to track incident ID and severity.
4. **Determine Triage Tier:** Follow the specific runbook below for the diagnosed failure mode.
5. **Mitigate First, Root Cause Later:** Restore user-facing availability before in-depth debugging.

---

## <a id="runbook-database-degradation"></a>2. Runbook: Database Degradation & Connection Pool Saturation

### 2.1 Symptoms
- Readiness probe returns `NOT_READY` with message: `Check connection pool capacity`.
- API error logs show `PrismaClientKnownRequestError` with connection timeout.
- Request latency percentiles (p95) spike above 1,000ms.

### 2.2 Safe Read-Only Diagnostics
```bash
# Check active connections and slow queries
SELECT count(*), state FROM pg_stat_activity GROUP BY state;

# Inspect top 5 longest running queries
SELECT pid, now() - query_start AS duration, query 
FROM pg_stat_activity 
WHERE state = 'active' 
ORDER BY duration DESC 
LIMIT 5;
```

### 2.3 Reversible Mitigations
1. **Throttle Background Workers:** Call self-healing action with operator attribution:
   ```json
   POST /reliability/self-healing/execute
   {
     "actionType": "THROTTLE_BACKGROUND_WORKERS",
     "targetComponent": "background-event-workers",
     "reason": "Database pool exhaustion mitigation",
     "operatorAttribution": "sre_oncall"
   }
   ```
2. **Scale API Connection Pool:** Increase `DATABASE_URL` pool size limit in environment config if PostgreSQL instance has spare capacity.

### 2.4 Potentially Destructive Actions (Requires Lead SRE Approval)
- Terminating runaway query PIDs: `SELECT pg_terminate_backend(pid);`
- Restarting primary PostgreSQL RDS instance (triggers failover to standby replica).

---

## <a id="runbook-webhook-delivery-failures"></a>3. Runbook: Webhook Delivery & Dead-Letter Backlog

### 3.1 Symptoms
- `OperationalMetricsService` reports elevated `deadLetterEvents`.
- Inbound partner events accumulating in status `DEAD_LETTER`.

### 3.2 Safe Read-Only Diagnostics
```bash
# Inspect dead-letter events in database
SELECT provider, count(*), last_error 
FROM "InboundWebhookEvent" 
WHERE status = 'DEAD_LETTER' 
GROUP BY provider, last_error;
```

### 3.3 Reversible Mitigation (Autonomous Redrive)
```json
POST /reliability/self-healing/execute
{
  "actionType": "REDRIVE_DEAD_LETTER_WEBHOOKS",
  "targetComponent": "STRIPE",
  "reason": "Partner endpoint service restored",
  "operatorAttribution": "sre_oncall"
}
```
*Note: Evaluates max 10 events per execution to prevent downstream saturation.*

---

## <a id="runbook-downstream-dependency-failure"></a>4. Runbook: Downstream Dependency Failure (Circuit Breaker Tripped)

### 4.1 Symptoms
- Circuit breaker state for external service transitions from `CLOSED` to `OPEN`.
- Deep health report `GET /health/dependencies` marks dependency as `DEGRADED`.

### 4.2 Reversible Mitigation
1. **Dampen Integration:** If non-critical (mapping or accounting), dampening ensures core bookings remain functional:
   ```json
   POST /reliability/self-healing/execute
   {
     "actionType": "DAMPEN_UNHEALTHY_INTEGRATION",
     "targetComponent": "EXTERNAL_MAPS_PROVIDER",
     "reason": "External API latency degradation",
     "operatorAttribution": "sre_oncall"
   }
   ```
2. **Reset Tripped Breaker:** Once upstream status page reports operational, reset circuit:
   ```json
   POST /reliability/self-healing/execute
   {
     "actionType": "RESET_TRIPPED_CIRCUIT_BREAKER",
     "targetComponent": "EXTERNAL_MAPS_PROVIDER",
     "reason": "Upstream vendor recovery verified"
   }
   ```

---

## <a id="runbook-queue-backlog-and-worker-stalling"></a>5. Runbook: Queue Backlog & Worker Stalling

### 5.1 Symptoms
- Background queue depth increasing exponentially.
- Event loop lag > 100ms.

### 5.2 Diagnostics & Mitigations
- Check worker process memory: `GET /health/live`.
- If memory heap ratio > 92%, restart worker pod gracefully: `kubectl rollout restart deployment/ecivres-worker -n production`.
- Draining in-flight tasks is handled automatically by `GracefulShutdownService`.
