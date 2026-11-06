# EcivreS Platform — Production Containerization Specification

**Phase:** Phase 24 — Production Deployment, Cloud Infrastructure, DevSecOps & Continuous Delivery  
**Version:** `16.0.0`  
**Status:** Approved & Validated

---

## 1. Containerization Principles

Every production container image in the EcivreS monorepo adheres to the following DevSecOps standards:

1. **Multi-Stage Builds:** Separation of heavy build toolchains (`npm`, `pnpm`, `typescript`, compilers) from lean production runtime containers.
2. **Minimal Base Images:** Based on official `node:22-alpine` for minimal attack surface ($\approx 180\text{ MB}$ runtime image size).
3. **Non-Root Execution:** All processes run under non-privileged user `node` (UID 1000 / GID 1000), mitigating container escape exploits.
4. **Build Context Optimization:** Strict `.dockerignore` files preventing `node_modules`, `.env`, and git history leakage into build layers.
5. **Built-in Health Checks:** Containers self-report health via HTTP probes (`/health/live` for API, `/` for Web) with bounded timeouts.
6. **Graceful Signal Handling:** Node.js executes directly as PID 1 (`CMD ["node", "..."]`), intercepting `SIGTERM` and `SIGINT` signals to allow active requests to drain cleanly.

---

## 2. Container Image Matrix

| Container Target | Dockerfile Path | Base Image | Non-Root User | Internal Port | Health Check Probe |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **API Backend** | `apps/api/Dockerfile.prod` | `node:22-alpine` | `node` (UID 1000) | `5001` | `wget -qO- http://127.0.0.1:5001/api/v1/health/live` |
| **Web Frontend**| `apps/web/Dockerfile.prod` | `node:22-alpine` | `node` (UID 1000) | `3000` | `wget -qO- http://127.0.0.1:3000/` |
| **Worker Service**| `Dockerfile.worker` | `node:22-alpine` | `node` (UID 1000) | N/A | Process event loop check |

---

## 3. Monorepo Build Context Management

Because EcivreS uses `pnpm-workspace.yaml`, building any sub-package requires accessing workspace manifests (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`) located at the repository root.

### Build Invocation:
```bash
# Build API container from repository root
docker build -f apps/api/Dockerfile.prod -t ecivres/api:v16.0.0 .

# Build Web container from repository root
docker build -f apps/web/Dockerfile.prod -t ecivres/web:v16.0.0 .

# Build Worker container from repository root
docker build -f Dockerfile.worker -t ecivres/worker:v16.0.0 .
```

---

## 4. Layer Caching & Secret Protection

- Package manifests are copied and installed in an isolated caching layer (`RUN pnpm install --frozen-lockfile`) before application code is copied. Source code changes do not invalidate dependency caches.
- Development `.env` files are explicitly excluded via `.dockerignore`. All environment variables and secrets must be injected at runtime via container task definitions or Kubernetes secrets.
