# EcivreS Platform — Staging Deployment Acceptance

**Date:** November 12, 2026  
**Auditor:** Release Manager & Platform Engineer  
**Scope:** Application Deployment Manifests & Staging Target Endpoints  

---

## 1. Deployment Topology & Target Endpoints

| Endpoint Tier | Staging Target URL | Local Development Equivalent | Protocol & Security |
| :--- | :--- | :--- | :--- |
| **API Ingress** | `https://staging-api.ecivres.com/api/v1` | `http://localhost:5001/api/v1` | TLS (Let's Encrypt Staging), Helmet CSP |
| **Web Ingress** | `https://staging.ecivres.com` | `http://localhost:3000` | TLS (Let's Encrypt Staging), HTTP Strict Transport |
| **API Health Probe** | `https://staging-api.ecivres.com/api/v1/health/live` | `http://localhost:5001/api/v1/health/live` | Unauthenticated bounded liveness probe |
| **API Ready Probe** | `https://staging-api.ecivres.com/api/v1/health/ready` | `http://localhost:5001/api/v1/health/ready` | Evaluates DB & Redis connection pools |

---

## 2. Deployment Artifacts & Manifests

### 2.1 Helm Chart Configuration (`helm/ecivres`)
- **Base Chart:** `helm/ecivres/Chart.yaml`
- **Staging Values:** `helm/ecivres/values-staging.yaml`
  - Replicas: 2 (Autoscaling: min 2, max 5, target CPU 75%)
  - Ingress: `staging-api.ecivres.com` with TLS cert-manager annotation
  - Port: `5001`
  - Resource Requests: `250m` CPU, `512Mi` Memory
  - Resource Limits: `1000m` CPU, `1024Mi` Memory

### 2.2 Docker Compose Staging Configuration
- Local multi-service orchestrator: `docker-compose.yml`
- Environment variables: injected from `.env` with non-conflicting port mapping (`5433:5432`).

---

## 3. Deployment Acceptance Criteria Assessment

| Acceptance Criterion | Status | Evidence |
| :--- | :--- | :--- |
| **Container Manifests Prepared** | **VERIFIED** | `Dockerfile.prod`, `Dockerfile.worker`, Helm charts. |
| **Image Versioning** | **VERIFIED** | Tagged with `staging-${GITHUB_SHA}`. |
| **Secret Injection Pattern** | **VERIFIED** | AWS Secrets Manager / Environment variable separation. |
| **Database Migration Ordering** | **VERIFIED** | `prisma migrate deploy` runs as pre-rollout Job. |
| **Live Remote Rollout** | **BLOCKED** | Awaiting AWS EKS cluster provisioning and operator approval. |
