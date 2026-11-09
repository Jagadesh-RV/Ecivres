output "primary_endpoint_address" {
  value       = aws_elasticache_replication_group.redis.primary_endpoint_address
  description = "The primary endpoint address for Redis cluster"
}

output "port" {
  value       = aws_elasticache_replication_group.redis.port
  description = "The Redis port"
}

output "arn" {
  value       = aws_elasticache_replication_group.redis.arn
  description = "The ARN of the ElastiCache replication group"
}

