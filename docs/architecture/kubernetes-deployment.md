# Kubernetes Enterprise Deployment Architecture

## Overview
EcivreS v2.0 Enterprise is deployed onto a production-ready Kubernetes cluster with Horizontal Pod Autoscaling (HPA), zero-downtime rolling updates, and TLS-terminated NGINX Ingress Controller.

```mermaid
graph TD
    Client[Web & Mobile Clients] --> Ingress[NGINX Ingress Controller]
    Ingress --> APIService[API ClusterIP Service :3001]
    APIService --> Pod1[API Pod 1]
    APIService --> Pod2[API Pod 2]
    APIService --> Pod3[API Pod N (HPA Auto-scaled)]
    Pod1 --> Redis[(Redis Cluster)]
    Pod1 --> Postgres[(PostgreSQL Replica)]
```

## Manifest Components
1. **API Deployment (`k8s/ecivres-production.yaml`)**:
   - 3 initial replicas, auto-scaling up to 15 pod replicas on 70% CPU threshold.
   - Resource bounds: 250m CPU / 512Mi Memory request, 1000m CPU / 1024Mi Memory limit.
   - Liveness Probe: `/api/v1/health` every 10s.
   - Readiness Probe: `/api/v1/health` every 5s.

2. **Ingress & TLS**:
   - Managed via `cert-manager` using Let's Encrypt production ClusterIssuer.
   - Enforces HTTPS for `api.ecivres.com` and `app.ecivres.com`.
