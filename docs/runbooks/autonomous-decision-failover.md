# Autonomous Decision Failover & Emergency Kill-Switch Runbook

## Emergency Kill-Switch Activation
In the event of unexpected platform behavior or model drift:

1. **Trigger Global Emergency Halt via API**:
   ```bash
   curl -X POST https://api.ecivres.com/v1/decision-intelligence/policy/kill-switch \
     -H "Authorization: Bearer $EXEC_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"reason": "Model drift detected in regional surge calculation"}'
   ```
2. **Environment Variable Override**:
   Set `DISABLE_AUTONOMOUS_ENGINE=true` in AWS ECS task definition and deploy immediately.

## Disaster Recovery Procedure
1. Revert platform to manual fallback pricing rules.
2. Inspect `AutonomousDecisionLog` records for root cause analysis.
3. Validate policy enforcer guardrails before re-enabling autonomous mode.
