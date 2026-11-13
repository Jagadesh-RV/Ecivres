# EcivreS Platform — Helm Chart Verification & Template Rendering Report

**Phase:** 28 — Real Cloud Deployment, Infrastructure Execution, Production-Grade Staging & Operational Acceptance  
**Release Target:** `v20.0.0-real-cloud-staging-operations`  
**Date:** November 13, 2026  
**Status:** **100% VERIFIED & ACCEPTED**  

---

## 1. Executive Summary

This report establishes operational acceptance for the EcivreS Kubernetes Helm deployment package (`helm/ecivres`). The chart provides complete declarative specification of containerized microservices, ingress routing, zero-downtime rolling updates, automated database schema migrations, externalized configurations, and horizontal pod autoscaling.

All templates have been authored following cloud-native best practices (CNCF, Kubernetes v1.28–v1.31) with strict namespace isolation and dynamic value overlays for `staging` and `production`.

---

## 2. Helm Chart Structure & Template Catalog

```
helm/ecivres/
├── Chart.yaml                  # Chart metadata and SemVer versioning
├── values.yaml                 # Base default values
├── values-staging.yaml         # Staging environment overlay
├── values-prod.yaml            # Production high-availability overlay
└── templates/
    ├── _helpers.tpl            # Template helpers for labels and selectors
    ├── deployment.yaml         # Deployment with rolling update strategy
    ├── service.yaml            # ClusterIP internal service definition
    ├── ingress.yaml            # Ingress controller routing and TLS termination
    ├── configmap.yaml          # ConfigMap for runtime environment flags
    ├── secrets.yaml            # Opaque Secret for credentials and connection URIs
    ├── hpa.yaml                # Autoscaling/v2 HorizontalPodAutoscaler
    └── migration-job.yaml      # Batch/v1 Pre-install and Pre-upgrade Hook Job
```

---

## 3. Template Specifications & Capabilities

### 3.1. Ingress & TLS Termination (`ingress.yaml`)
- **API Version:** `networking.k8s.io/v1`
- **Ingress Class:** `nginx`
- **TLS Automation:** Integrated with `cert-manager` using `cert-manager.io/cluster-issuer: letsencrypt-staging` (staging) and `letsencrypt-prod` (production).
- **SSL Enforcement:** `nginx.ingress.kubernetes.io/ssl-redirect: "true"`.

### 3.2. Automated Database Migration Job (`migration-job.yaml`)
- **API Version:** `batch/v1`
- **Hook Annotations:**
  - `helm.sh/hook: pre-install,pre-upgrade`
  - `helm.sh/hook-delete-policy: before-hook-creation,hook-succeeded`
  - `helm.sh/hook-weight: "1"`
- **Execution:** Runs `pnpm --filter api run db:migrate` prior to rolling out new API container replicas, guaranteeing zero schema-mismatch runtime errors.

### 3.3. Horizontal Pod Autoscaler (`hpa.yaml`)
- **API Version:** `autoscaling/v2`
- **Staging Parameters:**
  - Minimum Replicas: 2
  - Maximum Replicas: 5
  - Target CPU Utilization: 75%
- **Production Parameters:**
  - Minimum Replicas: 3
  - Maximum Replicas: 15
  - Target CPU Utilization: 70%

### 3.4. Secrets & External Integration (`secrets.yaml`)
- Supports inline base64 encoding as well as external secret synchronization (e.g., AWS Secrets Manager via External Secrets Operator).
- Enforces injection of `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, and `JWT_REFRESH_SECRET`.

---

## 4. Environment Comparison Matrix

| Configuration Attribute | Staging (`values-staging.yaml`) | Production (`values-prod.yaml`) |
| :--- | :--- | :--- |
| **Replica Count** | 2 replicas | 3 replicas |
| **HPA Max Replicas** | 5 replicas | 15 replicas |
| **CPU Requests / Limits** | 250m / 1000m | 500m / 2000m |
| **Memory Requests / Limits** | 512Mi / 1024Mi | 1024Mi / 2048Mi |
| **Ingress Hostname** | `staging-api.ecivres.com` | `api.ecivres.com` |
| **Cluster Issuer** | `letsencrypt-staging` | `letsencrypt-prod` |
| **Rolling Update Strategy** | `maxSurge: 25%`, `maxUnavailable: 0` | `maxSurge: 25%`, `maxUnavailable: 0` |
| **Database Migration Hook** | Enabled (weight 1) | Enabled (weight 1) |

---

## 5. Deployment Verification Checklist

- [x] Chart metadata conforms to Helm v3 specification.
- [x] All templates render valid Kubernetes v1.29+ YAML manifests.
- [x] Labels adhere to Kubernetes standard labels (`app.kubernetes.io/name`, `app.kubernetes.io/instance`, `app.kubernetes.io/managed-by`).
- [x] Liveness and Readiness probes configured on `/api/health`.
- [x] Migration hook guarantees database schema alignment before pod rollout.
- [x] HPA provides elastic scaling during traffic spikes.
- [x] Secrets segregated and encrypted via Kubernetes Secrets and AWS Secrets Manager.
