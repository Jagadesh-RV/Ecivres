# EcivreS Platform — Local Full-Stack Deployment Guide

## Overview

This guide details the procedure for deploying, running, and validating the complete multi-tier EcivreS platform locally.

---

## 1. Local Network Topology & Ports

To prevent collision with Windows native PostgreSQL services (ports 5432 and 5434), the local Docker environment maps the database container to host port `5433`:

| Service | Container Port | Host Port | Protocol | Health Probe |
| :--- | :--- | :--- | :--- | :--- |
| **PostgreSQL** | `5432` | `5433` | TCP | `pg_isready -U postgres -d ecivres` |
| **Redis** | `6379` | `6379` | TCP | `redis-cli ping` |
| **NestJS API** | `5001` | `5001` | HTTP | `GET /api/v1/health/ready` |
| **Next.js Web** | `3000` | `3000` | HTTP | `GET /` |

---

## 2. Step-by-Step Local Deployment

### Step 1: Start Infrastructure Containers
```bash
docker compose up -d postgres redis
```
Verify container health:
```bash
docker compose ps
```
Ensure `ecivres-postgres` and `ecivres-redis` transition to `(healthy)`.

### Step 2: Database Initialization & Seeding
From the monorepo root:
```bash
# Push schema or apply migrations
pnpm db:push

# Populate seed fixtures (categories, demo providers, customer accounts)
pnpm db:seed
```

### Step 3: Launch Full Monorepo
```bash
# Option A: Run all services in development mode via PNPM
pnpm dev

# Option B: Run via Docker Compose
docker compose up -d
```

---

## 3. Service Verification & Smoke Probes

### 3.1 API Health Check
```bash
curl http://localhost:5001/api/v1/health/live
# Expected: {"status":"UP","uptimeSeconds":15,"processId":1234,"timestamp":"..."}

curl http://localhost:5001/api/v1/health/ready
# Expected: {"status":"READY","checks":{"database":{"status":"HEALTHY","latencyMs":3},"backgroundWorkers":{"status":"HEALTHY"}}}
```

### 3.2 Web Frontend Verification
Open `http://localhost:3000` in your browser. Verify the home page, login screen (`/login`), and customer dashboard (`/customer`).

---

## 4. Teardown & Data Management

- **Stop containers without data loss**:
  ```bash
  docker compose down
  ```
- **Stop containers and purge volumes**:
  ```bash
  docker compose down -v
  ```
- **Inspect container logs**:
  ```bash
  docker compose logs -f api
  ```
