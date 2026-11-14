# Phase 29: Staging Infrastructure Activation Runbook

**Document ID:** `RUNBOOK-PHASE29-STAGING-001`  
**Target Environment:** Staging (`staging.ecivres.com`)  
**Audience:** Site Reliability Engineers (SRE), Cloud Operations, Release Managers  
**Version:** 1.0.0  

---

## 1. Prerequisites & Access Controls

Before executing any deployment or infrastructure activation, verify the operator environment:

1. **IAM & Cloud Credentials:**
   - Active AWS session in target account (Staging Account ID: `123456789012` or designated organization unit).
   - Identity must have `AdministratorAccess-Staging` or least-privilege role containing `eks:*`, `rds:*`, `ecr:*`, `route53:*`.
   - Ensure AWS CLI v2 is authenticated: `aws sts get-caller-identity`.

2. **Required Tooling Versions:**
   - Terraform: `>= 1.5.0`
   - Helm: `>= 3.12.0`
   - Kubectl: `>= 1.28.0`
   - Docker: `>= 24.0.0`
   - Node.js: `>= 20.10.0`
   - pnpm: `>= 9.0.0`

3. **Kubernetes Cluster Context:**
   - `aws eks update-kubeconfig --region us-east-1 --name ecivres-staging-eks`
   - Verify context: `kubectl config current-context` $\rightarrow$ `arn:aws:eks:us-east-1:...:cluster/ecivres-staging-eks`

---

## 2. Standard Deployment Procedure

### Step 1: Pre-Flight Verification & Secrets
Verify environment secrets exist in AWS Secrets Manager:
```bash
aws secretsmanager describe-secret --secret-id ecivres/staging/app-secrets --region us-east-1
```
Ensure required keys are populated: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `ENCRYPTION_KEY`.

### Step 2: Database Migration Execution
Run Prisma migrations in the isolated staging network:
```bash
cd apps/api
pnpm exec prisma migrate deploy
```
Verify zero pending migrations:
```bash
pnpm exec prisma migrate status
```

### Step 3: Container Image Build & ECR Push
Authenticate Docker with AWS ECR:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
```
Build and tag staging images:
```bash
# API
docker build -t 123456789012.dkr.ecr.us-east-1.amazonaws.com/ecivres-api:v21.0.0 -f apps/api/Dockerfile.prod .
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/ecivres-api:v21.0.0

# Web
docker build -t 123456789012.dkr.ecr.us-east-1.amazonaws.com/ecivres-web:v21.0.0 -f apps/web/Dockerfile.prod .
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/ecivres-web:v21.0.0
```

### Step 4: Infrastructure Provisioning (Terraform)
*Note: Requires explicit human authorization before executing `apply`.*
```bash
cd infrastructure/terraform/environments/staging
terraform init
terraform plan -out=staging.tfplan
terraform apply staging.tfplan
```

### Step 5: Kubernetes Manifest Deployment (Helm)
Deploy or upgrade the staging release:
```bash
helm upgrade --install ecivres-staging deploy/helm/ecivres \
  --namespace staging \
  --create-namespace \
  -f deploy/helm/ecivres/values-staging.yaml \
  --set api.image.tag=v21.0.0 \
  --set web.image.tag=v21.0.0 \
  --wait --timeout 10m
```

### Step 6: Post-Deployment Smoke & Health Validation
```bash
# Verify Kubernetes rollout status
kubectl rollout status deployment/ecivres-api -n staging
kubectl rollout status deployment/ecivres-web -n staging

# Synthetic Health Checks
curl -f https://api.staging.ecivres.com/health/live
curl -f https://api.staging.ecivres.com/health/ready
curl -f https://api.staging.ecivres.com/health/connectivity
curl -f https://staging.ecivres.com
```

---

## 3. Rollback & Emergency Procedures

### 3.1 Helm Application Rollback
If errors or SLO breaches occur post-deployment:
```bash
# Inspect release history
helm history ecivres-staging -n staging

# Roll back to immediate previous revision
helm rollback ecivres-staging 0 -n staging --wait --timeout 5m
```

### 3.2 Database Disaster Recovery (Restore Drill)
In the event of catastrophic data corruption or accidental migration loss:
1. Locate latest encrypted automated snapshot in S3:
   ```bash
   aws s3 ls s3://ecivres-staging-backups/database/ --recursive | sort | tail -n 1
   ```
2. Trigger automated restoration runbook:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts/restore-staging-drill.ps1
   ```
3. Verify table count ($113$) and index count ($241$) post-restore.

### 3.3 Emergency Kill Switch Activation
To immediately suspend all automated background jobs, worker redrives, and self-healing actions:
```bash
curl -X POST https://api.staging.ecivres.com/api/reliability/kill-switch \
  -H "Authorization: Bearer <OPERATOR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"action": "TRIP", "reason": "Emergency incident mitigation SEV1", "operatorId": "sre-ops-01"}'
```

---

## 4. Secret & Credential Rotation

### Database Password Rotation:
1. Generate new 32+ character high-entropy secret.
2. Update AWS Secrets Manager secret `ecivres/staging/database-password`.
3. Update RDS Master User Password:
   ```bash
   aws rds modify-db-instance --db-instance-identifier ecivres-staging-pg --master-user-password "<NEW_PASSWORD>" --apply-immediately
   ```
4. Restart API deployment pods to reload secrets:
   ```bash
   kubectl rollout restart deployment/ecivres-api -n staging
   ```

### JWT Signing Key Rotation:
1. Stage second key in environment: `JWT_SECONDARY_SECRET=<NEW_KEY>`.
2. Deploy API pods allowing token verification against either key.
3. Promote secondary key to primary after token expiration window ($15\text{ minutes}$).

---

## 5. Incident Escalation Matrix

| Severity | Definition | Initial Response SLA | Escalation Target | Actions |
| :--- | :--- | :--- | :--- | :--- |
| **SEV1** | Staging down, all health probes failing, data corruption risk | $< 15 \text{ min}$ | Lead SRE + DevOps Lead + Backend Lead | Initiate incident call, execute rollback or DR restore |
| **SEV2** | High error rates ($> 2\%$), single tier failure (e.g. web down, API up) | $< 30 \text{ min}$ | On-call SRE + Tier Engineer | Inspect CloudWatch logs, restart failed pods |
| **SEV3** | Minor performance degradation, non-blocking bug | $< 2 \text{ hours}$ | On-call Engineer | Log ticket, schedule standard release fix |
