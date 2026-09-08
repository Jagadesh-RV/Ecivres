# AWS Production Deployment Guide

## Infrastructure Architecture
- **EC2 / ECS Fargate**: Dockerized API and Worker containers behind ALB.
- **AWS RDS PostgreSQL**: Multi-AZ PostgreSQL 16 database.
- **Amazon ElastiCache Redis**: Cluster for BullMQ jobs and caching.
- **Amazon S3 & CloudFront**: Image uploads and CDN distribution.
- **AWS Route53 & ACM**: Managed DNS and SSL/TLS certificates.

## Deployment Command
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```
