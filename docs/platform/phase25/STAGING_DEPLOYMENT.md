# EcivreS Platform — Staging Deployment Specification & Procedures

## Overview

The Staging environment provides an isolated, production-parity platform for end-to-end integration testing, performance benchmarking, security scanning, and pre-release verification.

---

## 1. Staging Infrastructure Topology

- **AWS Region**: `us-east-1`
- **VPC CIDR**: `10.50.0.0/16`
- **Subnets**:
  - Public: `10.50.1.0/24`, `10.50.2.0/24`, `10.50.3.0/24` (ALB, NAT Gateways)
  - Private: `10.50.10.0/24`, `10.50.20.0/24`, `10.50.30.0/24` (EKS Nodes, RDS, ElastiCache)
- **Database**: Amazon RDS PostgreSQL 16.1 (`db.t4g.small`, 20GB-50GB gp3 storage)
- **Cache**: Amazon ElastiCache Redis 7 (`cache.t4g.micro`, 1 node)
- **Compute**: Amazon EKS 1.29 (`ecivres-staging-eks`, 2x `t4g.medium` managed nodes)
- **Ingress**: AWS Application Load Balancer with ACM TLS Certificate (`*.staging.ecivres.com`)

---

## 2. Automated Staging CI/CD Pipeline

Defined in `.github/workflows/staging-pipeline.yml`:
1. **Trigger**: Push to `develop` branch.
2. **Quality Gate**: Executes `pnpm lint`, `pnpm typecheck`, and `pnpm test`.
3. **Container Build**: Builds `ecivres-api:staging-${GITHUB_SHA}` and `ecivres-web:staging-${GITHUB_SHA}`.
4. **Security Scan**: Trivy scans images for CRITICAL/HIGH CVEs before registry push.
5. **ECR Push**: Images published to AWS Elastic Container Registry.
6. **EKS Rollout**: Helm deploys workloads into the `staging` namespace.
7. **Synthetic Health Probe**: Runs automated curl probes against `/health/ready` to verify zero downtime.

---

## 3. Staging Promotion Workflow

```mermaid
flowchart LR
    A[Feature Branch] -->|PR & Merge| B[develop Branch]
    B -->|Automatic CI/CD| C[Staging Pipeline]
    C -->|Trivy Scan & Build| D[Staging EKS Rollout]
    D -->|Synthetic Smoke Test| E[Staging Validation Gate]
    E -->|Approved Release| F[main Branch]
    F -->|Production Approval| G[Production EKS Release]
```

---

## 4. Staging Runbooks & Recovery

### Ingress & DNS Outage
- Check Route53 CNAME for `staging-api.ecivres.com` pointing to the staging ALB DNS.
- Check ACM certificate validation status in `us-east-1`.

### Redis High Memory or Pod Restart
- Access staging bastion host: `kubectl get pods -n staging -l app=ecivres-api`
- Run cache flush action via self-healing endpoint:
  ```bash
  curl -X POST https://staging-api.ecivres.com/api/v1/ops/self-healing/trigger \
    -H "Authorization: Bearer $STAGING_ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"actionType":"FLUSH_EPHEMERAL_CACHE","targetComponent":"REDIS_CACHE","reason":"Staging memory relief"}'
  ```
