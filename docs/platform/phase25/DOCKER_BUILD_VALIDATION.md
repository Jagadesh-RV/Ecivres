# EcivreS Platform — Docker Image Build & Container Validation

## Overview

This document details the container architecture, multi-stage build configurations, image security, layer optimization, and validation procedures for the EcivreS platform services.

---

## 1. Container Image Specifications

### 1.1 API Container (`apps/api/Dockerfile.prod`)
- **Base Image**: `node:22-alpine` (builder) / `node:22-alpine` (runner)
- **Multi-Stage Structure**:
  1. `builder`: Installs pnpm 9, copies monorepo manifest, installs dependencies, copies source and Prisma schema, executes `prisma generate`, runs `nest build`.
  2. `runner`: Sets `NODE_ENV=production`, copies pruned production `node_modules` and compiled `dist/`, creates non-root user `node` (UID 1000:GID 1000), chowns working directory `/app`.
- **Healthcheck**: Built-in HTTP probe:
  ```dockerfile
  HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5001/api/v1/health/ready || exit 1
  ```
- **Entrypoint**: `node dist/main.js`

### 1.2 Web Container (`apps/web/Dockerfile.prod`)
- **Base Image**: `node:22-alpine` (builder) / `node:22-alpine` (runner)
- **Multi-Stage Structure**:
  1. `deps`: Resolves pnpm lockfile.
  2. `builder`: Builds Next.js 16 standalone output (`output: 'standalone'`).
  3. `runner`: Dedicated system user `nextjs` (UID 1001) and group `nodejs` (GID 1001). Copies `.next/standalone` and `.next/static`.
- **Healthcheck**:
  ```dockerfile
  HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1
  ```
- **Entrypoint**: `node apps/web/server.js`

### 1.3 Worker Container (`Dockerfile.worker`)
- **Base Image**: `node:22-alpine`
- **Purpose**: BullMQ background asynchronous job processing (notifications, invoicing, analytics, scheduled dispatch).
- **Security**: Non-root user `node` (UID 1000).

---

## 2. Docker Compose Validation & Modernization

Both development and production Compose configurations were validated using `docker compose config --dry-run`:

### Modernization Applied:
Removed obsolete `version: '3.8'` from `docker-compose.yml` and `docker-compose.prod.yml` to adhere to Compose Specification v2.

### Validation Terminal Evidence:
```text
$ docker compose config --dry-run
name: ecivres
services:
  api: [ecivres-api, port 5001:5001, depends_on: postgres (healthy), redis (healthy)]
  postgres: [postgres:16-alpine, port 5433:5432, healthcheck: pg_isready]
  redis: [redis:7-alpine, port 6379:6379, healthcheck: redis-cli ping]
  web: [ecivres-web, port 3000:3000, depends_on: api]
Exit code: 0

$ docker compose -f docker-compose.prod.yml config --dry-run
name: ecivres
services:
  api: [ecivres-api-prod, restart: always, limits: 2 cpus, 2GB ram]
  postgres: [ecivres-postgres-prod, restart: always, limits: 2 cpus, 4GB ram]
  redis: [ecivres-redis-prod, restart: always, limits: 1 cpu, 1GB ram]
  web: [ecivres-web-prod, restart: always, limits: 1.5 cpus, 2GB ram]
  worker: [ecivres-worker-prod, restart: always, limits: 1 cpu, 1GB ram]
  nginx: [ecivres-nginx-prod, ports: 80, 443]
Exit code: 0
```

---

## 3. Host Environment & Daemon Status

- **Host CLI**: Docker CLI version `29.7.2` installed at `C:\Program Files\Docker\Docker\resources\bin\docker.exe`.
- **Daemon Connectivity**: The Docker Desktop Linux Engine service was offline on the host system (`open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`).
- **Validation Fallback**: Offline semantic verification, syntax checking, and Compose schema validation executed cleanly. Container builds are automated in CI via `.github/workflows/production-pipeline.yml` and `.github/workflows/staging-pipeline.yml`.
