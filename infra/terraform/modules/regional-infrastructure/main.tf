variable "aws_region" {
  type        = string
  description = "Target AWS deployment region for EcivreS regional marketplace stack"
}

variable "country_code" {
  type        = string
  description = "ISO 2-letter country code"
}

resource "aws_elasticache_replication_group" "regional_redis" {
  replication_group_id          = "ecivres-redis-${lower(var.country_code)}"
  replication_group_description = "Regional Redis cache cluster for ${var.country_code}"
  node_type                     = "cache.t4g.medium"
  num_cache_clusters           = 2
  automatic_failover_enabled    = true
  port                          = 6379
}

output "redis_primary_endpoint" {
  value = aws_elasticache_replication_group.regional_redis.primary_endpoint_address
}
