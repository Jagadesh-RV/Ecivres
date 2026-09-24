# Operational Runbook — Kubernetes Cluster Recovery

## Symptoms
- Node NotReady errors or HPA max threshold breach.

## Mitigation Steps
1. Add node capacity: `aws eks update-nodegroup-config --cluster-name ecivres-eks`.
2. Drain unhealthy worker node: `kubectl drain <node-name> --ignore-daemonsets`.
