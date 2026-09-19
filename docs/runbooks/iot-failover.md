# Operational Runbook: IoT Telemetry & MQTT Gateway Failover Protocol

## Trigger Conditions
- Secondary MQTT Broker heartbeat failure > 30 seconds.
- Telemetry drop rate > 0.5% over 5-minute rolling window.

## Automated Recovery Protocol
1. Anycast DNS failover redirects device MQTT traffic to Secondary Edge Broker.
2. Device Health Tracker flags offline broker node and notifies Ops Duty Engineer via PagerDuty.
3. Queue Worker drains dead-letter telemetry queue once primary broker node recovers.
