# EcivreS Platform — Rollback & Forward Recovery Strategy

**Phase:** Phase 24 — Production Deployment, Cloud Infrastructure, DevSecOps & Continuous Delivery  
**Version:** `16.0.0`  
**Status:** Approved & Validated

---

## 1. Rollback Decision Triggers

An immediate automated or manual rollback is initiated if within 15 minutes of deployment:
1. **HTTP 5xx Error Rate:** Spikes above $1.0\%$ across marketplace API routes.
2. **Readiness Probe Failure:** New container pods fail `/health/ready` check for $>3$ consecutive intervals.
3. **SLO Burn Rate:** Error budget burn rate exceeds $5.0\text{x}$ on `booking_lifecycle` or `payment_processing`.
4. **CrashLoopBackOff:** Container pods encounter runtime exceptions during bootstrap.

---

## 2. Container Rollback Execution

### AWS ECS / Fargate:
Revert task definition to previous active revision:
```bash
# Update ECS service to previous task definition revision
aws ecs update-service \
  --cluster ecivres-production-cluster \
  --service ecivres-api-service \
  --task-definition ecivres-api:PREVIOUS_REVISION_NUMBER
```

### Kubernetes / Helm:
```bash
# Roll back Helm deployment to previous revision
helm rollback ecivres -n production

# Verify rollback completion
kubectl rollout status deployment/ecivres-api -n production
```

---

## 3. Database Rollback vs. Forward Recovery

- **Backward-Compatible Schema (Expand-and-Contract):**
  Because all migrations in EcivreS follow the expand-and-contract pattern (strictly additive columns and tables), **rolling back application containers to previous revisions is safe and does NOT require rolling back database migrations**. Older application versions safely ignore newly added columns.
- **Data Recovery:**
  If unintended data corruption occurred, AWS Aurora / RDS Point-in-Time Recovery (PITR) is restored to an isolated staging instance for forensic recovery, never directly over production tables.
