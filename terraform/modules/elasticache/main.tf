terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_elasticache_subnet_group" "redis" {
  name       = "${var.environment}-redis-subnet-group"
  subnet_ids = var.subnet_ids
  tags       = var.tags
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id          = "${var.environment}-ecivres-redis"
  description                   = "Production Redis cluster for session, cache, and BullMQ queues"
  node_type                     = var.node_type
  num_cache_clusters            = var.num_cache_nodes
  port                          = 6379
  parameter_group_name          = "default.redis7"
  subnet_group_name             = aws_elasticache_subnet_group.redis.name
  security_group_ids            = var.security_group_ids
  at_rest_encryption_enabled    = true
  transit_encryption_enabled   = true
  auto_minor_version_upgrade    = true

  tags = var.tags
}
