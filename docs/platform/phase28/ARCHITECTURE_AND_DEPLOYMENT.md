# EcivreS Platform — Phase 28 Architecture & Deployment Specification

**Date:** November 12, 2026  
**Auditor:** Principal Software Architect & Cloud Infrastructure Engineer  
**Scope:** Monorepo System Architecture, Staging Topology & Ingress Boundaries  

---

## 1. Monorepo Structural Topology

The EcivreS platform is structured as an integrated pnpm workspace:

```
EcivreS Platform Monorepo
├── apps/
│   ├── api/                   # NestJS 11 Core Backend API (Port 5001)
│   ├── web/                   # Next.js 16.3.3 Turbopack Frontend (Port 3000)
│   └── mobile/                # Bare React Native 0.87.0 Mobile Application
├── helm/
│   └── ecivres/               # Kubernetes Deployment Helm Chart
├── terraform/
│   ├── modules/               # Modular AWS Infrastructure (VPC, RDS, Redis, EKS, KMS, S3)
│   └── environments/
│       ├── staging/           # Staging Infrastructure Configuration (CIDR: 10.50.0.0/16)
│       └── prod/              # Production Infrastructure Configuration (CIDR: 10.100.0.0/16)
└── docs/platform/phase28/     # Phase 28 Operational Runbooks & Audit Evidence
```

---

## 2. Staging Infrastructure Architecture

```mermaid
graph TD
    User([Customer / Provider / Admin Browser]) -->|HTTPS:443| CF[Amazon CloudFront CDN + WAF]
    CF -->|Static Assets| S3[Amazon S3 Web Origin]
    CF -->|API Traffic| ALB[AWS Application Load Balancer]
    
    subgraph VPC ["AWS VPC (10.50.0.0/16) - us-east-1"]
        subgraph PublicSubnets ["Public Subnets (10.50.1.0/24 - 10.50.3.0/24)"]
            ALB
            NAT[NAT Gateways]
        end
        
        subgraph PrivateSubnets ["Private Subnets (10.50.10.0/24 - 10.50.30.0/24)"]
            subgraph EKS ["Amazon EKS Cluster (ecivres-staging-eks)"]
                Ingress[Nginx Ingress Controller]
                API_Pod[ecivres-api Pods - 2x Replicas]
                Web_Pod[ecivres-web Pods - 2x Replicas]
                Worker_Pod[ecivres-worker Pod - BullMQ]
            end
            
            subgraph DataTier ["Isolated Private Data Tier"]
                RDS[(Amazon RDS PostgreSQL 16\ndb.t4g.small - KMS Encrypted)]
                Redis[(Amazon ElastiCache Redis 7\ncache.t4g.micro)]
            end
        end
    end
    
    ALB --> Ingress
    Ingress --> API_Pod
    Ingress --> Web_Pod
    API_Pod --> RDS
    API_Pod --> Redis
    Worker_Pod --> Redis
    Worker_Pod --> RDS
```

---

## 3. High-Availability & DevSecOps Controls

1. **Least-Privilege Network Scoping:** RDS PostgreSQL and ElastiCache Redis instances are strictly contained within private subnets with no public IP allocation.
2. **KMS Server-Side Encryption:** All EBS persistent volumes, RDS storage, and S3 buckets are encrypted with customer-managed keys (`aws_kms_key.staging_key`).
3. **Non-Root Container Enforcement:** Containers run under unprivileged `USER node` (UID 1000).
4. **Zero Shared Secrets:** Staging database credentials and cryptographic signing keys are injected dynamically via AWS Secrets Manager at container runtime.
