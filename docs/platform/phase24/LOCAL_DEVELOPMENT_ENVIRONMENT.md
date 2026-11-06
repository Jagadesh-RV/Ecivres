# EcivreS Platform — Local Development Environment Specification

**Phase:** Phase 24 — Production Deployment, Cloud Infrastructure, DevSecOps & Continuous Delivery  
**Version:** `16.0.0`  
**Status:** Approved & Validated

---

## 1. Local Environment Architecture

The local development environment provides a 100% reproducible, multi-service developer setup using `docker-compose.yml`.

```
Developer Workstation
        |
        v
+---------------------------------------------------------------------------------------+
|                          Isolated Bridge Network: ecivres-network                     |
|                                                                                       |
|  +------------------------+  +------------------------+  +-------------------------+  |
|  | ecivres-web (Next.js)  |  | ecivres-api (NestJS)   |  | ecivres-worker (BullMQ) |  |
|  | - Port 3000:3000       |  | - Port 5001:5001       |  | - Queue processing      |  |
|  | - Connects to API      |  | - Connects to DB/Redis |  | - Connects to DB/Redis  |  |
|  +------------------------+  +------------------------+  +-------------------------+  |
|                                          |                                            |
|                                          +---------------------+                      |
|                                                                |                      |
|                                                                v                      |
|  +--------------------------------------------------+  +---------------------------+  |
|  | ecivres-postgres (PostgreSQL 16)                 |  | ecivres-redis (Redis 7)   |  |
|  | - Port 5433:5432 (avoid host 5432 conflict)       |  | - Port 6379:6379          |  |
|  | - Volume: ecivres_postgres_data                  |  | - Volume: ecivres_redis_data|
|  | - Healthcheck: pg_isready                        |  | - Healthcheck: redis ping |  |
|  +--------------------------------------------------+  +---------------------------+  |
+---------------------------------------------------------------------------------------+
```

---

## 2. Startup Instructions

### Quick Start (Background Infrastructure Only):
If developing locally with native Node.js:
```powershell
# 1. Start PostgreSQL and Redis containers
docker compose up -d postgres redis

# 2. Push Prisma database schema & seed initial roles
pnpm --filter api exec prisma db push
pnpm --filter api run seed

# 3. Start API in watch mode
pnpm --filter api run dev

# 4. Start Web frontend in watch mode
pnpm --filter web run dev
```

### Full Containerized Stack:
To run the complete ecosystem in Docker containers:
```powershell
# Build and start all 4 services with health-based readiness
docker compose up -d --build

# View real-time container logs
docker compose logs -f

# Verify container health
docker compose ps
```

---

## 3. Shutdown & Cleanup Procedures

```powershell
# Graceful stop
docker compose down

# Stop and remove persistent data volumes (Full Reset)
docker compose down -v
```
