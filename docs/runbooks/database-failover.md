# Manual Database Failover Runbook

## Procedure

1. **Verify Primary Outage**:
   ```bash
   aws rds describe-db-instances --db-instance-identifier prod-ecivres-db --query 'DBInstances[0].DBInstanceStatus'
   ```
2. **Trigger Failover to Multi-AZ Secondary**:
   ```bash
   aws rds reboot-db-instance --db-instance-identifier prod-ecivres-db --force-failover
   ```
3. **Verify Replica Promotion & DNS CNAME Cutover**:
   - PgBouncer automatic connection pool re-pointing.
   - Run synthetic check: `bash scripts/verify-deployment.sh`
