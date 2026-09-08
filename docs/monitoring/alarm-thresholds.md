# AWS CloudWatch Metric Alarm Thresholds

| Metric Name | Threshold | Action |
| --- | --- | --- |
| `HTTPCode_Target_5XX_Count` | > 10 in 1 min | SNS High-Priority Alert to On-Call Dev |
| `TargetResponseTime` | > 1000ms p99 for 5 mins | Auto-scale ECS Task Instance Count |
| `CPUUtilization` | > 80% for 3 mins | Trigger Auto-Scaling Group Scale-Out |
| `DatabaseConnections` | > 80% max limit | Alert Database Administrator |
| `RedisMemoryUtilization` | > 85% | Trigger Eviction Policy & Scale Cluster |
