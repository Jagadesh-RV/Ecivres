# EcivreS Platform — Cloud Architecture Specification

**Phase:** Phase 24 — Production Deployment, Cloud Infrastructure, DevSecOps & Continuous Delivery  
**Version:** `16.0.0`  
**Status:** Approved & Validated  
**Lead Cloud Architect:** Principal Cloud Architect & DevOps Lead (Jagadesh R <jagadeshrvs@gmail.com>)

---

## 1. Cloud Architecture Overview

The EcivreS production cloud architecture is engineered on **Amazon Web Services (AWS)** to deliver high availability, multi-region disaster readiness, auto-scaling elasticity, and zero-trust security boundaries.

```
+---------------------------------------------------------------------------------------+
|                                    User Ingress                                       |
|             (Web Browser Clients, Mobile App Clients, Partner API Webhooks)           |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                           Amazon CloudFront CDN (Global Edge)                         |
|                   - Static Asset Caching (Next.js public assets, S3)                  |
|                   - AWS WAF v2 (OWASP Top 10, IP rate limits, bot control)            |
|                   - Automated TLS Termination (AWS Certificate Manager)               |
+---------------------------------------------------------------------------------------+
                    |                                           |
                    | (Static Assets)                           | (Dynamic API & Web)
                    v                                           v
+---------------------------------------+   +-------------------------------------------+
|          Amazon S3 Bucket             |   |         Application Load Balancer         |
|   (Static Next.js exports, media)     |   |         (Public Subnets in 3 AZs)         |
+---------------------------------------+   +-------------------------------------------+
                                                                |
                                                                v
+---------------------------------------------------------------------------------------+
|                       Private Application Subnets (VPC 10.0.0.0/16)                   |
|                                                                                       |
|  +-----------------------------------+     +---------------------------------------+  |
|  | AWS ECS / Fargate (ecivres-api)   |     | AWS ECS / Fargate (ecivres-web)       |  |
|  | - Port 5001, Auto-scaled (2-10)   |     | - Port 3000, Auto-scaled (2-8)        |  |
|  | - Non-root execution (UID 1000)   |     | - Next.js SSR & Server Actions        |  |
|  | - Bounded Health Probes           |     | - Reverse proxy to API via internal   |  |
|  +-----------------------------------+     +---------------------------------------+  |
|                    |                                           |                      |
|                    +---------------------+---------------------+                      |
|                                          |                                            |
|                                          v                                            |
|                    +-------------------------------------------+                      |
|                    | AWS ECS / Fargate (ecivres-worker)        |                      |
|                    | - BullMQ Async Processing                 |                      |
|                    | - DLQ Re-drive & Self-Healing Tasks       |                      |
|                    +-------------------------------------------+                      |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                        Isolated Database Subnets (Zero Internet Access)               |
|                                                                                       |
|  +-----------------------------------------+   +-----------------------------------+  |
|  | AWS Aurora / RDS PostgreSQL 16 (Multi-AZ)|   | AWS ElastiCache Redis 7           |  |
|  | - Primary Read/Write (us-east-1a)       |   | - Primary & Read Replica Cluster  |  |
|  | - Standby Read Replica (us-east-1b)     |   | - In-transit & At-rest encryption |  |
|  | - Automated KMS encryption              |   | - Auth token enabled              |  |
|  | - PgBouncer connection pooling          |   | - Session & Queue caching         |  |
|  +-----------------------------------------+   +-----------------------------------+  |
+---------------------------------------------------------------------------------------+
```

---

## 2. Infrastructure Component Evaluation

### 2.1 Compute: AWS ECS/Fargate vs. EKS vs. App Runner
| Criteria | AWS ECS/Fargate (Selected) | AWS EKS (Enterprise Alternative) | AWS App Runner |
| :--- | :--- | :--- | :--- |
| **Operational Overhead** | **Low:** Serverless containers; no control-plane management or node patching. | **High:** Requires dedicated Kubernetes cluster management, ingress controller updates, CNI tuning. | **Minimal:** Limited custom VPC and PgBouncer networking. |
| **Networking & VPC** | **Full VPC Integration:** Direct internal connectivity to RDS and ElastiCache. | **Full VPC Integration:** Complex CNI plugin IP allocation. | **Restricted:** VPC connector egress only; difficult internal service discovery. |
| **Cost Profile** | **Pay-per-second:** Zero idle cluster charge; ideal for dynamic marketplace loads. | **Cluster Fee:** \$73/month base cluster fee + node pools. | **Medium:** Low baseline, but scaling transitions can be expensive. |
| **Recommendation** | **Primary Choice for EcivreS production.** | **Retained as supported option in `k8s/` and `helm/` for enterprise clients.** | Not recommended due to connection pooling constraints. |

---

## 3. Security Boundaries & Zero-Trust Network Architecture

1. **Public Edge (Internet-Facing):**
   - CloudFront CDN and Application Load Balancer (ALB) reside in public subnets (`10.0.1.0/24`, `10.0.2.0/24`, `10.0.3.0/24`).
   - Inbound traffic restricted to HTTPS (Port 443) governed by AWS WAF rulesets.
2. **Private Application Tier:**
   - ECS Fargate tasks reside in private subnets (`10.0.10.0/24`, `10.0.20.0/24`, `10.0.30.0/24`).
   - Egress traffic routes through AWS NAT Gateways; zero direct inbound internet routes.
3. **Isolated Database Tier:**
   - RDS PostgreSQL and ElastiCache Redis reside in completely isolated database subnets (`10.0.100.0/24`, `10.0.200.0/24`).
   - Security groups permit inbound connections **only** from the ECS API and Worker task security groups.

---

## 4. Estimated Infrastructure Cost Model (Monthly)

> [!NOTE]
> These figures represent engineering architectural estimates based on AWS us-east-1 on-demand pricing, not verified contractual quotes.

| Resource | Configuration | Estimated Monthly Cost |
| :--- | :--- | :--- |
| **AWS ECS / Fargate Compute** | 4 vCPU, 8 GB RAM aggregate across API, Web, Worker (auto-scaled) | \$142.00 |
| **AWS RDS PostgreSQL (Multi-AZ)**| `db.t4g.large` (2 vCPU, 8 GB RAM, 100 GB gp3 SSD, Multi-AZ) | \$196.00 |
| **AWS ElastiCache Redis** | `cache.t4g.medium` (Cluster mode, Multi-AZ) | \$68.00 |
| **Application Load Balancer** | 1 ALB with WAF v2 association | \$38.00 |
| **CloudFront & S3 Storage** | 200 GB egress, 50 GB storage, KMS requests | \$24.00 |
| **NAT Gateways (2 AZs)** | 2 NAT Gateways with data processing | \$72.00 |
| **Total Estimated Cloud Baseline**| **Production Multi-AZ Architecture** | **~\$540.00 / month** |
