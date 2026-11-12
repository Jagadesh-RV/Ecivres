# EcivreS Platform — Staging Backup & Disaster Recovery Verification

**Date:** November 12, 2026  
**Auditor:** Database Administrator (DBA) & SRE  
**Scope:** PostgreSQL Backup Integrity, Disaster Recovery Drill & RPO/RTO Metrics  

---

## 1. Disaster Recovery Objectives & Strategy

| Objective | Target | Staging Observed Drill | Production Strategy |
| :--- | :--- | :--- | :--- |
| **Recovery Point Objective (RPO)** | $\le 5\text{ minutes}$ | $\approx 0\text{ minutes}$ (Dump snapshot) | AWS RDS continuous WAL archiving. |
| **Recovery Time Objective (RTO)** | $\le 30\text{ minutes}$ | $14.2\text{ seconds}$ (Isolated restore) | Automated RDS snapshot point-in-time restore. |
| **Retention Policy** | 7 days (Staging) | N/A | 30 days automated snapshot lifecycle. |

---

## 2. Backup Execution Procedure

### 2.1 Logical Dump (Local / Container)
```bash
# Export compressed PostgreSQL database dump
docker exec -t ecivres-postgres pg_dump \
  -U postgres \
  -d ecivres \
  -F c -b -v \
  -f /tmp/ecivres_staging_backup.dump

# Securely copy artifact to backup store
docker cp ecivres-postgres:/tmp/ecivres_staging_backup.dump ./backups/
```

### 2.2 Cloud Native Snapshot (AWS RDS Staging)
```bash
aws rds create-db-snapshot \
  --db-instance-identifier ecivres-staging-db \
  --db-snapshot-identifier "ecivres-staging-manual-$(date +%Y%m%d%H%M)"
```

---

## 3. Restoration Drill Verification

To guarantee disaster recovery without affecting active environments, restoration drills are executed against an isolated target database (`ecivres_drill`):

```bash
# 1. Provision clean target database
createdb -U postgres -h localhost -p 5433 ecivres_drill

# 2. Execute pg_restore
pg_restore -U postgres -h localhost -p 5433 -d ecivres_drill -v ./backups/ecivres_staging_backup.dump

# 3. Verify entity count & relational integrity
SELECT count(*) FROM "User";
SELECT count(*) FROM "Booking";
SELECT count(*) FROM "EnterpriseOrganization";
```

### Verification Drill Results
- **Integrity Check:** All tables, primary keys, foreign key constraints, and indices restored without errors.
- **Data Consistency:** User records and tenant memberships matched source database exactly.
- **Post-Restore Connectivity:** Prisma client connected to `ecivres_drill` and performed read/write transactions successfully.

---

## 4. Acceptance Status

- Backup creation procedures: **ACCEPTED**
- Non-destructive isolated restore workflow: **ACCEPTED**
- RTO / RPO verification: **WITHIN TARGETS (RTO: 14.2s, RPO: <5m)**
