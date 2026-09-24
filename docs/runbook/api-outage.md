# Operational Runbook — API Service Outage

## Symptoms
- HTTP 502 / 503 / 504 errors on `/api` routes.
- Pod crash loops or memory exhaustion on NestJS API deployments.

## Mitigation Steps
1. Inspect Kubernetes pod status: `kubectl get pods -n ecivres-prod`.
2. Check recent logs: `kubectl logs -l app=api --tail=100`.
3. Scale up replica count: `kubectl scale deployment api --replicas=10`.
4. Trigger automated rollback if build digest is unhealthy: `POST /rollback/execute`.
