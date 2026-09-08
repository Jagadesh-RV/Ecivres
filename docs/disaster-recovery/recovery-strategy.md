# Disaster Recovery & Backup Strategy

## RPO & RTO Targets
- **Recovery Point Objective (RPO)**: < 5 minutes (Continuous Automated WAL Archiving)
- **Recovery Time Objective (RTO)**: < 30 minutes

## Backup Procedures
1. **Automated RDS Snapshots**: Daily full backups retained for 35 days.
2. **Point-In-Time Restore (PITR)**: Enabled for transaction logs.
3. **S3 Cross-Region Replication**: Storage bucket mirrored to backup region.
