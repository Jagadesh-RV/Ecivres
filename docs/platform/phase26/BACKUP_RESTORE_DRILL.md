# EcivreS Platform — Backup & Disaster Recovery Validation

**Date:** November 10, 2026  
**Auditor:** Database Administrator & SRE  

---

## 1. Recovery Objectives (RPO & RTO)

| Service | Target RPO | Target RTO | Strategy |
| :--- | :--- | :--- | :--- |
| **PostgreSQL (RDS)** | $\le 5\text{ minutes}$ | $\le 30\text{ minutes}$ | Continuous Write-Ahead Log (WAL) archiving + automated daily snapshots. Retention: 30 days prod, 7 days staging. |
| **Redis (ElastiCache)** | $\le 1\text{ hour}$ | $\le 15\text{ minutes}$ | Daily automated RDB snapshots + replication failover. |
| **S3 Media Assets** | $\le 1\text{ minute}$ | $\le 10\text{ minutes}$ | S3 Versioning enabled + Cross-Region Replication (CRR). |

---

## 2. Backup Execution Procedures

### 2.1 AWS RDS Automated Snapshots
- Maintenance window: `03:00 - 04:00 UTC` daily.
- Deletion protection enforced in prod: `deletion_protection = true`.
- Final snapshot identifier: `prod-ecivres-db-final-snapshot`.

### 2.2 Manual On-Demand Snapshot Command
```bash
aws rds create-db-snapshot \
  --db-instance-identifier prod-ecivres-db \
  --db-snapshot-identifier prod-ecivres-db-manual-$(date +%Y%m%d%H%M%S) \
  --region us-east-1
```

### 2.3 Local PostgreSQL Backup Command
```bash
docker exec -t ecivres-postgres pg_dump -U postgres -d ecivres -F c -b -v -f /tmp/ecivres_backup.dump
docker cp ecivres-postgres:/tmp/ecivres_backup.dump ./backups/
```

---

## 3. Database Restoration Drill Verification

1. **Restoration Command**:
   ```bash
   aws rds restore-db-instance-from-db-snapshot \
     --db-instance-identifier staging-db-restore-verification \
     --db-snapshot-identifier prod-ecivres-db-manual-snapshot \
     --db-instance-class db.t4g.small \
     --subnet-group-name staging-rds-subnet-group \
     --region us-east-1
   ```
2. **Integrity Validation**:
   - Verify table schemas, primary keys, and row counts across `User`, `Booking`, and `ServiceOffering`.
   - Run verification suite against restored target:
     ```bash
     DATABASE_URL="postgresql://postgres:password@staging-db-restore-verification.internal:5432/ecivres" pnpm --filter api test
     ```
3. **Teardown**: Terminate verification instance to avoid ongoing cloud costs.
