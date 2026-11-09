# EcivreS Platform — Backup, Disaster Recovery & Restore Validation

## Overview

This document specifies the database snapshot, point-in-time recovery (PITR), and disaster recovery validation procedures for EcivreS staging and production environments.

---

## 1. Recovery Objectives (RPO & RTO)

| Service | Target RPO | Target RTO | Strategy |
| :--- | :--- | :--- | :--- |
| **Amazon RDS PostgreSQL** | $\le 5\text{ minutes}$ | $\le 30\text{ minutes}$ | Automated continuous WAL archiving + daily AWS snapshots (retention: 30 days prod, 7 days staging). |
| **Amazon ElastiCache Redis** | $\le 1\text{ hour}$ | $\le 15\text{ minutes}$ | Ephemeral cache + BullMQ persistent queue state backed up via daily RDB snapshots. |
| **Amazon S3 Media Assets** | $\le 1\text{ minute}$ | $\le 10\text{ minutes}$ | S3 Versioning enabled + Cross-Region Replication (CRR) to secondary region. |

---

## 2. Backup Execution Procedures

### 2.1 AWS RDS Automated Snapshots
RDS takes daily automated snapshots during the configured maintenance window (`03:00 - 04:00 UTC`).
- Production deletion protection enabled: `deletion_protection = true`.
- Final snapshot enforced on deletion: `skip_final_snapshot = false`, `final_snapshot_identifier = "prod-ecivres-db-final-snapshot"`.

### 2.2 Manual On-Demand Snapshot Command
```bash
aws rds create-db-snapshot \
  --db-instance-identifier prod-ecivres-db \
  --db-snapshot-identifier prod-ecivres-db-manual-$(date +%Y%m%d%H%M%S) \
  --region us-east-1
```

### 2.3 Local PostgreSQL Backup (Development / Staging)
```bash
docker exec -t ecivres-postgres pg_dump -U postgres -d ecivres -F c -b -v -f /tmp/ecivres_backup.dump
docker cp ecivres-postgres:/tmp/ecivres_backup.dump ./backups/
```

---

## 3. Database Restoration Verification

To validate that backup artifacts are healthy and non-corrupted:
1. Spin up an isolated PostgreSQL instance or staging target:
   ```bash
   aws rds restore-db-instance-from-db-snapshot \
     --db-instance-identifier staging-db-restore-test \
     --db-snapshot-identifier prod-ecivres-db-manual-snapshot \
     --db-instance-class db.t4g.small \
     --subnet-group-name staging-rds-subnet-group \
     --region us-east-1
   ```
2. Verify table integrity and row counts across core marketplace tables (`User`, `Booking`, `ServiceOffering`).
3. Point API test runner to restored instance:
   ```bash
   DATABASE_URL="postgresql://postgres:password@staging-db-restore-test.internal:5432/ecivres" pnpm --filter api test src/modules/reliability/e2e-deployment.spec.ts
   ```
4. Teardown restored verification instance.
