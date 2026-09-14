resource "aws_elasticache_subnet_group" "redis" {
  name       = "ecivres-redis-subnet-group"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id, aws_subnet.private_c.id]
}

resource "aws_security_group" "redis" {
  name        = "ecivres-redis-sg"
  description = "Allow Redis traffic from VPC"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id = "ecivres-redis-cluster"
  description          = "Production EcivreS Redis ElastiCache Replication Group"
  node_type            = "cache.m6g.large"
  num_cache_clusters   = 2
  port                 = 6379
  parameter_group_name = "default.redis7"
  subnet_group_name    = aws_elasticache_subnet_group.redis.name
  security_group_ids   = [aws_security_group.redis.id]

  automatic_failover_enabled = true
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true

  tags = {
    Name = "ecivres-redis-cluster"
  }
}
