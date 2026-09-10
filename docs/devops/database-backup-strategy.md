# PostgreSQL Database Backup & Automated Snapshot Strategy

## Overview
Automated backup procedure for PostgreSQL database instance powering EcivreS.

## Backup Policy
1. **Automated Daily Snapshots**: Retained for 30 days.
2. **Point-in-Time Recovery (PITR)**: Write-Ahead Logging (WAL) archiving enabling recovery to any millisecond within 7 days.
3. **Weekly Offsite Backups**: Encrypted pg_dump backups uploaded to AWS S3 Glacier (`s3://ecivres-db-backups-vault/`).

## Verification Procedure
Run automated restore verification container monthly:
```bash
pg_restore -h localhost -U postgres -d ecivres_backup_verify s3_backup.dump
```
