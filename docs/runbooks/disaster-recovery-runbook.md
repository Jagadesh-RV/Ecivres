# Multi-Region Disaster Recovery & Emergency Failover Runbook

## Target RTO & RPO SLAs
- **Recovery Time Objective (RTO)**: ≤ 5 minutes
- **Recovery Point Objective (RPO)**: ≤ 30 seconds

## Failover Execution Workflow

```mermaid
sequenceDiagram
    participant Monitor as Route 53 Health Check
    participant Primary as Primary Region (us-east-1)
    participant Secondary as Secondary Region (us-west-2)
    participant DNS as Route 53 Failover Routing

    Primary->>Monitor: 3 Consecutive Health Failures
    Monitor->>DNS: Trigger Failover Event
    DNS->>Secondary: Route 100% Traffic to Standby EKS Cluster
    Secondary->>Secondary: Promote Read Replica to Primary Database
```

## Emergency Procedures
1. **Promote Standby Database**: `aws rds promote-read-replica --id ecivres-postgres-uswest2`
2. **Update DNS Endpoint**: `aws route53 change-resource-record-sets --hosted-zone-id Z12345 --change-batch file://dr-dns-switch.json`
3. **Notify On-Call Response Team**: PagerDuty incident automatically generated.
