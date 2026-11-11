# EcivreS Platform — Docker Runtime & Image Validation

**Date:** November 10, 2026  
**Auditor:** Senior DevOps & Platform Engineer  

---

## 1. Container Configuration Audit

The repository contains three production Docker container specifications:

### 1.1 API Container (`apps/api/Dockerfile.prod`)
- **Base Image**: `node:22-alpine` (multi-stage)
- **User Execution**: Non-root system user `node` (UID:GID `1000:1000`)
- **Compilation Gate**: Runs `prisma generate` and `nest build`
- **Health Check Probe**:
  ```dockerfile
  HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5001/api/v1/health/ready || exit 1
  ```
- **Entrypoint**: `node dist/main.js`

### 1.2 Web Application Container (`apps/web/Dockerfile.prod`)
- **Base Image**: `node:22-alpine` (multi-stage)
- **User Execution**: Non-root system user `nextjs` (UID:GID `1001:1001`)
- **Next.js Mode**: Standalone output (`output: 'standalone'`)
- **Health Check Probe**:
  ```dockerfile
  HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1
  ```
- **Entrypoint**: `node apps/web/server.js`

### 1.3 Background Queue Worker Container (`Dockerfile.worker`)
- **Base Image**: `node:22-alpine`
- **User Execution**: Non-root system user `node` (UID:GID `1000:1000`)
- **Entrypoint**: `node dist/worker.js`

---

## 2. Docker Compose Verification

Compose configurations were statically and semantically verified with `docker compose config --dry-run`:

```bash
docker compose config --dry-run
docker compose -f docker-compose.prod.yml config --dry-run
```

**Results:**
- Both files parsed cleanly with exit code `0`.
- Deprecated `version: '3.8'` warnings were completely absent.
- Networks, volume definitions, resource limits, and healthcheck dependencies (`service_healthy`) are correctly configured.

---

## 3. Host Runtime Status & Known Limitation

- **Docker CLI**: Docker version `29.7.2` installed at `C:\Program Files\Docker\Docker\resources\bin\docker.exe`.
- **Runtime Daemon**: The Docker Desktop Linux Engine daemon was offline during local verification (`open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`).
- **Classification**: **STATICALLY VALIDATED**. Live container execution locally requires starting the Docker Desktop daemon service on the Windows host.
