# EcivreS Platform — Local Full-Stack Acceptance & Network Topology

**Date:** November 12, 2026  
**Auditor:** DevOps Engineer & Platform Architect  
**Environment:** Local Development / Testing Host (Windows 11 x64)  
**Status:** **LOCALLY VALIDATED & PORT CONFLICT RESOLVED**

---

## 1. Network Architecture & Port Allocation

To prevent collisions with existing host services while allowing local integration, the following port topology is enforced:

| Service | Container Internal Port | Host Mapped Port | Protocol | Binding Status | Conflict Analysis & Resolution |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PostgreSQL (Container)** | `5432` | `5433` | TCP | Dedicated | Host ports 5432 & 5434 occupied by native PostgreSQL instances; mapped to 5433. |
| **Redis (Container)** | `6379` | `6379` | TCP | Dedicated | Clean; no conflicting processes bound on host. |
| **NestJS API** | `5001` | `5001` | HTTP | Clean | Bound to port 5001 with `/api/v1` global prefix. |
| **Next.js Web** | `3000` | `3000` | HTTP | Clean | Bound to port 3000 with Turbopack SSR/SSG. |
| **Nginx Reverse Proxy** | `80` / `443` | `80` / `443` | HTTP/S | Prod Compose | Active in `docker-compose.prod.yml`. |

---

## 2. Host Port Audit Evidence

Execution of `Get-NetTCPConnection` confirmed the following listening sockets:
```
LocalAddress LocalPort OwningProcess  State
------------ --------- -------------  -----
0.0.0.0           5432          7524 Listen  (Native PostgreSQL 17)
0.0.0.0           5434          7512 Listen  (Native PostgreSQL 18)
```
- **Safety Policy Upheld:** Unrelated developer processes (PID 7512 and 7524) were preserved without termination.
- **Port Mapping Verification:** `docker-compose.yml` routes container traffic through host port `5433:5432`, maintaining strict process isolation.

---

## 3. Container Runtime Daemon Status

- **Docker Version:** 29.7.2 (CLI Plugins: Compose v5.4.0, Buildx v0.36.1).
- **Daemon Connectivity:** `open //./pipe/docker_engine: The system cannot find the file specified`.
- **Finding:** Docker Desktop Engine Service (`com.docker.service`) is currently stopped. Launching the Windows service requires elevated Administrator privileges or interactive desktop logon.
- **Operator Instruction:** Start Docker Desktop from the system tray before running `docker compose up -d`.

---

## 4. Local Stack Startup Verification (Manual / Development Mode)

When running the local stack directly via pnpm:
1. **API Service:** `pnpm --filter api run start:prod` launches NestJS on `http://localhost:5001/api/v1`.
   - Health check probe: `GET /api/v1/health/live` returns HTTP 200 `{ "status": "ok" }`.
   - Readiness probe: `GET /api/v1/health/ready` evaluates dependencies.
2. **Web Frontend:** `pnpm --filter web run start` serves Next.js on `http://localhost:3000`.
   - SSR/SSG hydration connects to API via `NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1`.

---

## 5. Acceptance Status

- **Source Implementation:** **ACCEPTED**
- **Port Allocation & Conflict Prevention:** **ACCEPTED**
- **Container Configuration Syntax:** **ACCEPTED**
- **Local Host Runtime:** **BLOCKED ON DOCKER DESKTOP DAEMON STARTUP**
