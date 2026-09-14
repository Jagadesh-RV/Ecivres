# Enterprise Incident Response Protocol (SEV 1 - SEV 4)

## Severity Levels & Response Times

| Severity | Impact | SLA Initial Response | Target Resolution |
| --- | --- | --- | --- |
| **SEV 1** | Total system outage, payments down, data corruption risk | 15 Minutes | < 2 Hours |
| **SEV 2** | Partial degradation (e.g. search slow, single region down) | 30 Minutes | < 4 Hours |
| **SEV 3** | Non-critical feature broken (e.g. export PDF failure) | 2 Hours | < 24 Hours |
| **SEV 4** | Minor UI bug or typo | 24 Hours | Next Sprint |

## Incident Management Workflow

1. **Detection**: Automated Prometheus / Grafana alert fires or customer report logged.
2. **Triaging**: On-call engineer acknowledges alert via PagerDuty within SLA.
3. **Containment**: Execute runbook mitigation (e.g. enable rate limiting, activate fallback, route traffic to secondary region).
4. **Post-Mortem**: Publish Blameless Post-Mortem within 48 hours.
