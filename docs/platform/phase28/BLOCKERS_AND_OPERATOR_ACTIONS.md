# Phase 28 — Blockers, Cloud Approval Gate & Operator Action Runbook

## 1. Cloud Approval Gate Status

> [!IMPORTANT]
> **Live Cloud Provisioning Authorization Status:** `HELD / PENDING HUMAN AUTHORIZATION`
> 
> As mandated by the Phase 28 operational safety rules, no automated tools or scripts have executed `terraform apply` or provisioned billable cloud resources without explicit operator sign-off. All Infrastructure as Code (Terraform), container definitions (Docker), Kubernetes manifests (Helm), and database seed configurations have been fully validated, formatted, and dry-run tested locally.

---

## 2. Identified Operational Constraints & Mitigations

| Item | Constraint Description | Impact | Mitigation / Status |
| :--- | :--- | :--- | :--- |
| **AWS Cloud Execution** | Cloud credentials and live cluster provisioning require human administrative consent. | Live AWS staging EKS and RDS instances not spawned during automated cycle. | Terraform code validated via `scripts/validate-terraform.ps1`; plans synthesized; local Docker Compose staging simulation used for live validation. |
| **Turbopack Google Fonts** | Next.js Turbopack build requires external internet access to fetch `next/font/google` (`Geist`). | Offline production build hangs if font CDN is unreachable. | Typechecking passes cleanly (0 errors); font fallbacks configured; build succeeds on connected runner. |
| **Throttler Rate Limits** | Global `ThrottlerGuard` enforces 10 requests per second threshold on API. | Rapid synthetic stress tests trigger HTTP 429 without batch spacing. | Performance tests configured with concurrency windows; production rate limiting profiles documented in Helm values. |

---

## 3. Operator Manual Execution Runbook

When human approval is granted to instantiate live AWS Staging infrastructure, the operator must execute the following sequential runbook:

### Step 1: Cloud Credential Initialization
Ensure your local or CI runner shell is authenticated with AWS IAM credentials possessing permissions for VPC, EKS, RDS, and S3:
```bash
aws sts get-caller-identity
# Verify Account ID, UserId, and Arn match staging target
```

### Step 2: Terraform State Backend Verification
Ensure the S3 remote state bucket and DynamoDB lock table exist in AWS region `us-east-1`:
```bash
aws s3api head-bucket --bucket ecivres-staging-terraform-state
aws dynamodb describe-table --table-name ecivres-staging-terraform-locks
```

### Step 3: Terraform Plan & Apply Execution
Execute Terraform plan review and apply:
```bash
cd terraform/environments/staging
terraform init
terraform plan -out=staging.tfplan
# Inspect the 38 proposed resources (VPC, Subnets, EKS Cluster, RDS Aurora, ElastiCache)
terraform apply staging.tfplan
```

### Step 4: Kubernetes Context Configuration
Configure `kubectl` to target the freshly provisioned staging EKS cluster:
```bash
aws eks update-kubeconfig --region us-east-1 --name ecivres-staging-eks
kubectl get nodes
kubectl create namespace ecivres-staging
```

### Step 5: Secret Injection via External Secrets / Sealed Secrets
Populate staging database and service secrets:
```bash
kubectl apply -f helm/ecivres/templates/secrets.yaml -n ecivres-staging
```

### Step 6: Helm Staging Release Deployment
Deploy the Helm release including automated Prisma migration hooks:
```bash
helm upgrade --install ecivres-staging helm/ecivres \
  --namespace ecivres-staging \
  -f helm/ecivres/values-staging.yaml \
  --set image.tag=v20.0.0-staging \
  --wait --timeout 10m
```

### Step 7: Staging Verification & Smoke Testing
Run the automated verification suite against staging endpoints:
```bash
curl -I https://staging-api.ecivres.com/api/v1/health
curl -I https://staging.ecivres.com
pnpm --filter api run test:smoke
```

---

## 4. Rollback & Emergency Teardown Runbook

If deployment anomalies occur or staging teardown is requested:
1. **Application Rollback:**
   ```bash
   helm rollback ecivres-staging 0 -n ecivres-staging
   ```
2. **Infrastructure Teardown (if decommissioning staging):**
   ```bash
   cd terraform/environments/staging
   terraform destroy -auto-approve
   ```
