# EcivreS Platform — Infrastructure as Code (IaC) Specification

**Phase:** Phase 24 — Production Deployment, Cloud Infrastructure, DevSecOps & Continuous Delivery  
**Version:** `16.0.0`  
**Status:** Approved & Validated

---

## 1. Terraform Architecture & Module Catalog

EcivreS cloud infrastructure is declaratively defined using **Terraform v1.6+** organized into modular, reusable HCL components located under `terraform/`:

```
terraform/
├── main.tf                    # Root provider configuration & state backends
├── vpc.tf                     # 3-tier VPC network topology (Public, Private, Database)
├── rds.tf                     # Multi-AZ PostgreSQL configuration with KMS
├── elasticache.tf             # Redis cluster configuration with transit encryption
├── secrets.tf                 # AWS Secrets Manager secret references
├── waf.tf                     # AWS WAF v2 WebACL rulesets
├── environments/
│   └── prod/                  # Production environment root
│       ├── main.tf
│       └── terraform.tfvars
└── modules/
    ├── vpc/                   # Modular VPC subnet calculator
    ├── rds/                   # Modular PostgreSQL RDS engine
    ├── elasticache/           # Modular Redis engine
    ├── eks/                   # Modular EKS Kubernetes cluster
    ├── kms/                   # Customer-Managed Key (CMK) encryption
    └── s3_cdn/                # S3 origin bucket with CloudFront distribution
```

---

## 2. DevSecOps Security Controls in IaC

1. **At-Rest Encryption:**
   - RDS PostgreSQL storage encrypted using dedicated AWS KMS Customer-Managed Key (`module.kms`).
   - ElastiCache Redis encrypted at-rest using KMS and in-transit using TLS with `auth_token`.
   - S3 buckets enforce `aws:SecureTransport` SSL-only policies and AES-256 SSE encryption.
2. **State Security & State Locking:**
   - Terraform state stored in remote encrypted S3 bucket (`ecivres-terraform-state-prod`).
   - DynamoDB table (`ecivres-terraform-locks`) enforces concurrent deployment locking to prevent race conditions.
3. **Safe Destroy Protections:**
   - Production RDS instances and S3 storage enforce `deletion_protection = true` and `prevent_destroy = true`.

---

## 3. Terraform Validation Workflow

```bash
# Initialize Terraform without remote backend for offline verification
cd terraform/environments/prod
terraform init -backend=false

# Validate HCL syntax and references
terraform validate

# Check code formatting across all modules
terraform fmt -check -recursive ../../
```

> [!IMPORTANT]
> In accordance with safety rules, `terraform apply` is executed exclusively via automated GitHub Actions on the protected `main` branch following manual approval gates.
