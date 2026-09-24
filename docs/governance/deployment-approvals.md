# Deployment Approval Gates Specification

## Environment Approval Matrix
- **Development**: Automatic deployment upon successful CI check merge on `develop`.
- **Staging**: Requires 1 Team Lead approval on `staging` environment with secret isolation.
- **Production**: Requires 2 Engineering Director approvals on `production` environment with 15-minute soak wait timer, lock concurrency, and 30-minute execution timeout.
