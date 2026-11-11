# EcivreS Platform — Local Environment Validation & Execution Guide

**Date:** November 10, 2026  
**Auditor:** Senior Site Reliability Engineer  

---

## 1. Local Architecture & Port Map

| Component | Target Host Port | Container Port | Protocol | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **PostgreSQL** | `5433` | `5432` | TCP | Avoids conflict with Windows native PostgreSQL services on ports 5432 & 5434 |
| **Redis** | `6379` | `6379` | TCP | Ephemeral cache and BullMQ job queues |
| **NestJS API** | `5001` | `5001` | HTTP | Backend REST API & WebSockets |
| **Next.js Web** | `3000` | `3000` | HTTP | Customer & Provider Frontend |

---

## 2. Local Startup Workflow

### Step 1: Start Docker Infrastructure
```powershell
# Start Docker Desktop if not running
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Launch infrastructure containers
docker compose up -d postgres redis
```

### Step 2: Database Setup
```bash
# Push schema to local database
pnpm db:push

# Seed initial categories and demo accounts
pnpm db:seed
```

### Step 3: Run Full Monorepo
```bash
pnpm dev
```

---

## 3. Verified Local Smoke Checks

Once containers are active:
- **Liveness Probe**: `curl http://localhost:5001/api/v1/health/live` $\rightarrow$ `{"status":"UP", ...}`
- **Readiness Probe**: `curl http://localhost:5001/api/v1/health/ready` $\rightarrow$ `{"status":"READY", ...}`
- **Web Frontend**: `curl http://localhost:3000` $\rightarrow$ HTTP 200 HTML document
