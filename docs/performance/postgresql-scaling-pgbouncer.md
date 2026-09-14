# PostgreSQL Scaling & PgBouncer Connection Pooling Architecture

## Overview
EcivreS scales PostgreSQL queries up to 100,000+ concurrent users using PgBouncer connection pooling and read/write splitting.

```mermaid
graph TD
    API[EKS API Pods (100+ instances)] --> PgBouncer[PgBouncer Pooler Service :6432]
    PgBouncer --> Primary[RDS PostgreSQL Primary (Writes)]
    API --> Replica[RDS Read Replica 1 (Reads)]
    API --> Replica2[RDS Read Replica 2 (Reads)]
```

## Scaling Specifications
- **PgBouncer Mode**: `transaction` mode supporting up to 10,000 client connections per pod.
- **Read/Write Splitting**: Read queries (`SELECT`) route to Multi-AZ Read Replicas; Write queries (`INSERT`, `UPDATE`, `DELETE`) route to Primary instance.
- **Slow Query Detection**: AWS Performance Insights flags queries executing over 100ms.
