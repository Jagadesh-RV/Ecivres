# Blue-Green Zero-Downtime Deployment Strategy

## Deployment Workflow
1. **Build Step**: Build production Docker images (`Dockerfile.prod` for API and Web).
2. **Staging Environment**: Deploy target green environment and run health check probes (`GET /api/v1/health`).
3. **Database Migrations**: Run non-breaking backward-compatible Prisma migrations (`prisma migrate deploy`).
4. **Traffic Cutover**: Switch AWS Application Load Balancer (ALB) target group from Blue to Green.
5. **Drain Connections**: Gracefully drain active WebSocket connections on old Blue tasks.
