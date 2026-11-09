# EcivreS Platform — DevSecOps & Security Hardening Verification

## Overview

This document details the security controls, container execution safeguards, cryptographic secret governance, and network boundary protections implemented across the EcivreS platform.

---

## 1. Non-Root Container Execution Audit

All Dockerfiles enforce non-root user execution at the operating system level to eliminate container escape escalation risks:

| Container | User / Group | UID:GID | Home Directory | Shell |
| :--- | :--- | :--- | :--- | :--- |
| **API** (`apps/api/Dockerfile.prod`) | `node:node` | `1000:1000` | `/home/node` | `/sbin/nologin` |
| **Web** (`apps/web/Dockerfile.prod`) | `nextjs:nodejs` | `1001:1001` | `/home/nextjs` | `/sbin/nologin` |
| **Worker** (`Dockerfile.worker`) | `node:node` | `1000:1000` | `/home/node` | `/sbin/nologin` |

All application directories (`/app`) are chowned during the build phase; the runtime process executes with dropped root capabilities.

---

## 2. Cryptographic Secret Validation at Application Startup

Implemented in `apps/api/src/config/env-validation.ts`:
- **Deterministic Assertion**: When `NODE_ENV === 'production'`, the service verifies that all JWT and session secrets are cryptographically random strings ($\ge 32$ characters).
- **Fallback Rejection**: Rejects known insecure defaults:
  - `super_secret_access_token_key_change_in_prod`
  - `super_secret_refresh_token_key_change_in_prod`
  - `change_me`
  - `default_secret`
- **Failure Mode**: Immediately terminates process startup with a fatal error:
  `[DEVSECOPS CRITICAL] Production startup halted. Insecure development fallback detected in JWT secrets.`

Verified via 4/4 passing unit tests in `apps/api/src/config/env-validation.spec.ts` and automated E2E assertion in `e2e-deployment.spec.ts`.

---

## 3. Network Isolation & Database Boundaries

1. **Private Subnet Placement**: In AWS EKS and RDS Terraform definitions, all databases (`aws_db_instance.postgres`) and Redis clusters (`aws_elasticache_replication_group.redis`) are provisioned exclusively in private VPC subnets with zero public IP assignment.
2. **Security Group Pinning**: Database ingress is restricted to the EKS cluster security group and private VPC CIDR (`10.100.0.0/16` prod, `10.50.0.0/16` staging) on TCP port 5432.
3. **Database TLS Enforcement**: PostgreSQL parameter group parameter `rds.force_ssl = "1"` enforces encrypted in-transit connections from all API containers.

---

## 4. Container & Dependency Vulnerability Scanning

- **CI/CD Integration**: Aqua Security Trivy (`aquasecurity/trivy-action@master`) runs on every container image build prior to ECR publishing.
- **Vulnerability Threshold**: Configured with `severity: 'CRITICAL,HIGH'` and `ignore-unfixed: true`. Builds containing exploitable high-severity vulnerabilities are halted.
