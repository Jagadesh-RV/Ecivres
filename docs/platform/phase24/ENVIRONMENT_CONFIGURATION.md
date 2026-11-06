# EcivreS Platform — Environment Configuration & Secrets Management

**Phase:** Phase 24 — Production Deployment, Cloud Infrastructure, DevSecOps & Continuous Delivery  
**Version:** `16.0.0`  
**Status:** Approved & Validated

---

## 1. Environment Matrix

| Variable Name | Description | Development Default | Staging Source | Production Source |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | Runtime environment mode | `development` | `staging` | `production` |
| `API_PORT` | Backend listening port | `5001` | `5001` | `5001` |
| `DATABASE_URL` | PostgreSQL connection string with pool bounds | `postgresql://postgres:password@localhost:5433/ecivres` | AWS Secrets Manager (Staging Aurora) | AWS Secrets Manager (Prod Aurora Multi-AZ) |
| `REDIS_HOST` | Redis cache hostname | `localhost` or `redis` | AWS ElastiCache Endpoint | AWS ElastiCache Endpoint |
| `REDIS_PORT` | Redis port | `6379` | `6379` | `6379` |
| `REDIS_PASSWORD` | Redis authentication token | (optional in dev) | AWS Secrets Manager | AWS Secrets Manager |
| `JWT_ACCESS_SECRET` | HMAC SHA-256 signing secret for access tokens | Dev fallback | AWS KMS / Secrets Manager | AWS KMS / Secrets Manager |
| `JWT_REFRESH_SECRET`| Signing secret for refresh tokens | Dev fallback | AWS KMS / Secrets Manager | AWS KMS / Secrets Manager |
| `CORS_ORIGINS` | Permitted browser origins | `http://localhost:3000,http://localhost:5001` | `https://staging.ecivres.com` | `https://ecivres.com` |
| `NEXT_PUBLIC_API_URL`| API base URL for Web frontend | `http://localhost:5001/api/v1` | `https://api-staging.ecivres.com/api/v1` | `https://api.ecivres.com/api/v1` |

---

## 2. Secrets Management Protocol

1. **Zero Secret Check-in:** Real credentials, tokens, or encryption keys are strictly prohibited from being committed to git.
2. **Dynamic Runtime Injection:** In cloud deployments, ECS task definitions pull secrets directly from **AWS Secrets Manager** via IAM task role policies:
   ```json
   {
     "name": "DATABASE_URL",
     "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:ecivres/prod/database-url"
   }
   ```
3. **Startup Validation:** The API validates all injected configuration upon startup via `validateProductionEnvironment()`.
