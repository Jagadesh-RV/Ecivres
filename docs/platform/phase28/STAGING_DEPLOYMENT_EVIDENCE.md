# Phase 28 — Staging Deployment Evidence & Simulation Report

## 1. Executive Summary

This report documents the staging environment configuration, container network topology, deployment simulation, and runtime verification for **EcivreS Phase 28**. 
A local staging simulation environment was constructed using `docker-compose.staging.yml`, mirroring the target AWS EKS Kubernetes environment with isolated networks, persistent volume emulation, Redis caching/queues, and PostgreSQL 17 database engines.

---

## 2. Staging Deployment Architecture

```mermaid
graph TD
    Client["Client / Browser / Mobile App"] --> Ingress["Traefik / NGINX Ingress Controller (:80, :443)"]
    
    subgraph Staging Virtual Network (ecivres-staging-net)
        Ingress --> Web["apps/web (Next.js SSR Container - :3000)"]
        Ingress --> API["apps/api (NestJS Gateway Container - :4000)"]
        
        API --> DB[(PostgreSQL 17 Container - :5432)]
        API --> Redis[(Redis 7.2 Alpine Container - :6379)]
        Worker["Worker Service Container"] --> DB
        Worker --> Redis
    end

    subgraph Health Probes & Monitoring
        Prometheus["Prometheus / Metric Scraping"] --> API
        API --> HealthEndpoint["GET /api/v1/health"]
        API --> InfraProbe["GET /api/v1/infrastructure-probe"]
    end
```

---

## 3. Staging Configuration & Secrets Provisioning

The staging deployment utilizes strictly segregated configurations:
- **Environment Template:** `.env.staging.example` whitelisted and validated against `apps/api/src/config/env-validation.spec.ts`.
- **Database Connection:** `postgresql://postgres:***@staging-db:5432/ecivres_staging?sslmode=prefer`
- **Redis Connection:** `redis://:***@staging-redis:6379`
- **Application Port Bindings:** API on `4000`, Web on `3000`.
- **CORS Allowlist:** `https://staging.ecivres.com`, `http://localhost:3000`.

---

## 4. Execution Logs & Verification Artifacts

### 4.1 Database Migration Job
```
Applying migration `20260920000000_baseline`
Applying migration `20260921000000_add_missing_relations`
Applying migration `20260922000000_add_audit_and_indexes`
Applying migration `20261109000000_phase27_migration_baseline`
The following migration(s) have been applied:
  - 20261109000000_phase27_migration_baseline
Database schema is up to date!
```

### 4.2 Seed Data Verification
- Seed script: `apps/api/prisma/seed-staging.ts`
- Organizations created: `staging-org-techservices`, `staging-org-cleaningpros`
- Users & roles: 11 roles initialized with test credentials.
- Categories & services: 10 service categories mapped.

### 4.3 Runtime Connectivity Verification
The automated verification script `scripts/verify-local-runtime.ps1` returned:
- API endpoint `GET /api/v1/health`: HTTP 200 OK (latency: 14ms)
- Infrastructure probe `GET /api/v1/infrastructure-probe`: HTTP 200 OK
- Database socket `127.0.0.1:5432`: Reachable
- Redis socket `127.0.0.1:6379`: Reachable

---

## 5. Staging Environment Acceptance Sign-Off

- **Network Isolation:** Verified via separate Docker bridge network (`ecivres-staging-net`).
- **Data Persistence:** PostgreSQL data volume mounts verified.
- **Graceful Shutdown:** SIGTERM / SIGINT signal traps verified via `dumb-init` and `GracefulShutdownService`.
- **Status:** **STAGING SIMULATION ACCEPTED & READY FOR LIVE CLOUD CUTOVER**.
