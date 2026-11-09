# EcivreS Platform — Infrastructure as Code (Terraform) Architecture

## Overview

The EcivreS cloud infrastructure is codified using HashiCorp Terraform (v1.5+). The architecture adopts a modular, multi-environment design separating shared infrastructure modules from environment-specific configurations (`staging` and `prod`).

---

## 1. Modular Hierarchy

```text
terraform/
├── environments/
│   ├── prod/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── outputs.tf
│   └── staging/
│       ├── main.tf
│       ├── variables.tf
│       ├── terraform.tfvars
│       └── outputs.tf
├── modules/
│   ├── eks/             # Kubernetes cluster & node groups
│   ├── elasticache/     # Encrypted Redis cluster
│   ├── kms/             # Customer-managed encryption keys
│   ├── rds/             # Multi-AZ PostgreSQL 16
│   ├── s3_cdn/          # S3 storage + CloudFront CDN
│   └── vpc/             # Multi-AZ VPC, subnets, NAT Gateways
├── main.tf              # Shared root provider & backend config
├── secrets.tf           # AWS Secrets Manager & random passwords
└── waf.tf               # AWS WAF v2 web ACLs
```

---

## 2. Environment Sizing & Configuration Comparison

| Component | Staging Environment | Production Environment | Security Rationale |
| :--- | :--- | :--- | :--- |
| **VPC CIDR** | `10.50.0.0/16` | `10.100.0.0/16` | Distinct CIDRs prevent routing collisions during VPC peering. |
| **Subnet Layout** | 3 Public / 3 Private | 3 Public / 3 Private | Public for Ingress/NAT, Private for compute & storage. |
| **PostgreSQL Tier** | `db.t4g.small` (Single-AZ) | `db.r6g.xlarge` (Multi-AZ) | Staging optimizes cost; Prod optimizes high availability & failover. |
| **PostgreSQL SSL** | Enforced (`rds.force_ssl=1`) | Enforced (`rds.force_ssl=1`) | Encrypted in-flight across all environments. |
| **Redis Cluster** | `cache.t4g.micro` (1 node) | `cache.r6g.large` (3 nodes) | Transit & at-rest encryption enabled in both. |
| **Compute Engine** | EKS (2x `t4g.medium` nodes) | EKS (4-12x `m6g.xlarge` nodes) | Autoscaling enabled. |
| **Storage & CDN** | S3 + CloudFront (OAC) | S3 + CloudFront (OAC) | Direct public bucket access blocked via S3 Bucket Policy. |
| **KMS Encryption** | Dedicated Staging Key | Dedicated Production Key | Independent key rotation and access policies. |

---

## 3. Secret Management & Elimination of Hardcoded Credentials

In Phase 25, cleartext passwords in `terraform/secrets.tf` were replaced with programmatic high-entropy secret generation:

```hcl
resource "random_password" "master_db_password" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_secretsmanager_secret" "database_credentials" {
  name                    = "ecivres/production/database"
  recovery_window_in_days = 7
  kms_key_id              = aws_kms_key.master.key_id

  tags = {
    Name = "ecivres-db-credentials"
  }
}

resource "aws_secretsmanager_secret_version" "database_credentials_val" {
  secret_id = aws_secretsmanager_secret.database_credentials.id
  secret_string = jsonencode({
    username = "ecivres_admin"
    password = random_password.master_db_password.result
    engine   = "postgres"
    port     = 5432
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}
```

---

## 4. Terraform Validation Pipeline

The CI workflow `.github/workflows/terraform-ci.yml` enforces automated static validation:
1. `terraform fmt -check -recursive terraform/`
2. `terraform init -backend=false` in `terraform/environments/staging`
3. `terraform validate` in `terraform/environments/staging`
4. `terraform init -backend=false` in `terraform/environments/prod`
5. `terraform validate` in `terraform/environments/prod`
