# Phase 19 — Security, Privacy & Governance
## Threat Analysis, Access Boundaries & Data Minimization

## 1. Zero Trust Access Model
- **Endpoint Protection**: All Phase 19 REST endpoints are protected by NestJS Guards requiring authenticated JWT tokens and appropriate role claims.
- **Role Isolation**:
  - `ADMIN` / `SECURITY_LEAD`: Access to human moderation queue, incident resolution, circuit breaker manual resets, and health metrics.
  - `CUSTOMER` / `PROVIDER`: Can only submit appeals for incidents where their `userId` matches the `targetId`.
- **Tenant Isolation**: Every `MarketplaceTrustIncident` and `DecisionExplanationRecord` requires an indexed `tenantId`. Cross-tenant querying is strictly prevented.

---

## 2. Privacy & Data Minimization
- **Evidence Sanitization**: `DecisionExplainabilityService.sanitizeEvidence()` automatically strips secrets, passwords, authentication tokens, API keys, and payment card numbers before persistence.
- **PII Protection**: Telemetry metrics enforce bounded categorical labels. Customer names, emails, and phone numbers are excluded from Prometheus metric series.

---

## 3. Residual Risks & Mitigations
- **Downstream Provider Blackouts**: Mitigated by circuit breakers with graceful fallback functions returning cached data.
- **Review Syndicates**: Sophisticated slow-drip review rings may bypass rapid velocity checks; addressed by periodic batch graph analysis in Phase 17/18 intelligence pipelines.
