# Runbook: Autonomous Marketplace Incident Remediation

## Objective
Standard Operating Procedure (SOP) for handling marketplace anomalies and executing human-in-the-loop approvals during automated incident remediation.

## Workflow Procedures
1. **Anomaly Detection Alert Trigger**:
   - Monitored via `/admin/anomalies`.
   - Critical anomalies generate automated tickets and notify duty engineer.
2. **Reviewing Pending Approvals**:
   - Access `/admin/automation/approvals`.
   - Inspect `context` and `riskLevel`.
   - Execute `PATCH /admin/automation/approvals/:id/review` with `action: "APPROVED"` or `"REJECTED"` and explicit rationale.
3. **Emergency Circuit Breaker**:
   - To pause all automated actions immediately, disable target policy via `AutomationPolicyService.update(id, { isActive: false })`.
