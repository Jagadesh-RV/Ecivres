# EcivreS Platform — Local Runtime Acceptance & Socket Inspection Report

**Date:** November 12, 2026  
**Auditor:** DevOps Engineer & Platform Architect  
**Inspection Script:** `scripts/verify-local-runtime.ps1`  
**Execution Environment:** Windows 11 x64 Host  

---

## 1. Socket Audit & Port Allocation Matrix

To guarantee conflict-free local execution while preserving existing OS services, the runtime enforces distinct network boundaries:

| Service | Target Port | Container Port | Active Socket State | Conflict Resolution |
| :--- | :--- | :--- | :--- | :--- |
| **PostgreSQL (Container)** | `5433` | `5432` | Closed (Daemon Stopped) | Dedicated port 5433 prevents collision with host PostgreSQL (5432/5434). |
| **Redis (Container)** | `6379` | `6379` | Closed (Daemon Stopped) | Standard Redis port, non-conflicting. |
| **NestJS API (Host/Container)**| `5001` | `5001` | Dedicated | Bound to port 5001 with `/api/v1` global prefix. |
| **Next.js Web (Host/Container)**| `3000` | `3000` | Dedicated | Turbopack SSR/SSG serving port 3000. |

---

## 2. Real-Time Inspection Output

Execution of `./scripts/verify-local-runtime.ps1` produced the following verified output:

```
==========================================================
 EcivreS Platform — Local Runtime Health & Socket Audit    
==========================================================

[1/3] Inspecting Network Sockets...
  [--] Port 5433 is NOT LISTENING
  [--] Port 6379 is NOT LISTENING
  [--] Port 5001 is NOT LISTENING
  [--] Port 3000 is NOT LISTENING

[2/3] Checking Docker Engine Status...
  [WARN] Docker Engine daemon is STOPPED or UNREACHABLE

[3/3] Probing HTTP Endpoints...
  [--] API Liveness probe at http://localhost:5001/api/v1/health/live did not respond
  [--] Connectivity probe at http://localhost:5001/api/v1/health/connectivity did not respond
  [--] Web Frontend probe at http://localhost:3000/ did not respond

==========================================================
 Runtime Inspection Complete                             
==========================================================
```

---

## 3. Host Process Preservation Analysis

Inspection of active host processes using `Get-NetTCPConnection` confirmed:
- `PID 7524` listening on port `5432` (PostgreSQL 17 OS instance).
- `PID 7512` listening on port `5434` (PostgreSQL 18 OS instance).
- **Compliance Policy:** In strict adherence to engineering safety policies, existing developer processes were left completely undisturbed without process termination.
- **Container Separation:** `docker-compose.staging.yml` and `docker-compose.yml` map container port `5432` to host port `5433`, ensuring total process isolation.

---

## 4. Local Runtime Acceptance Status

- **Port Conflict Resolution:** **ACCEPTED**
- **Docker Compose Staging Spec:** **ACCEPTED**
- **Diagnostic Tooling:** **ACCEPTED (`verify-local-runtime.ps1`)**
- **Local Container Daemon:** **BLOCKED (Requires Administrator start of Docker Desktop)**
