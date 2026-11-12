output "vpc_id" {
  value       = module.vpc.vpc_id
  description = "Staging VPC ID"
}

output "public_subnet_ids" {
  value       = module.vpc.public_subnet_ids
  description = "Staging public subnet IDs"
}

output "private_subnet_ids" {
  value       = module.vpc.private_subnet_ids
  description = "Staging private subnet IDs"
}

output "db_endpoint" {
  value       = module.rds.endpoint
  description = "Staging RDS PostgreSQL endpoint"
}

output "db_address" {
  value       = module.rds.address
  description = "Staging RDS PostgreSQL address"
}

output "db_port" {
  value       = module.rds.port
  description = "Staging RDS PostgreSQL port"
}

output "db_name" {
  value       = module.rds.db_name
  description = "Staging RDS PostgreSQL database name"
}

output "db_arn" {
  value       = module.rds.arn
  description = "Staging RDS PostgreSQL instance ARN"
}

output "db_connection_url_format" {
  value       = "postgresql://<DB_USER>:<DB_PASSWORD>@${module.rds.endpoint}/${module.rds.db_name}?sslmode=require"
  description = "Connection URI format for Staging RDS database"
  sensitive   = false
}

output "redis_primary_endpoint" {
  value       = module.elasticache.primary_endpoint_address
  description = "Staging Redis cluster primary endpoint"
}

output "redis_port" {
  value       = module.elasticache.port
  description = "Staging Redis cluster port"
}

output "redis_connection_url_format" {
  value       = "redis://${module.elasticache.primary_endpoint_address}:${module.elasticache.port}"
  description = "Connection URI format for Staging Redis cluster"
  sensitive   = false
}

output "eks_cluster_id" {
  value       = module.eks.cluster_id
  description = "Staging EKS Cluster ID"
}

output "eks_cluster_arn" {
  value       = module.eks.cluster_arn
  description = "Staging EKS Cluster ARN"
}

output "eks_cluster_endpoint" {
  value       = module.eks.cluster_endpoint
  description = "Staging EKS API server endpoint"
}

output "eks_cluster_certificate_authority_data" {
  value       = module.eks.cluster_certificate_authority_data
  description = "Staging EKS Cluster CA certificate data"
  sensitive   = true
}

output "cdn_domain_name" {
  value       = module.s3_cdn.cloudfront_domain_name
  description = "Staging CloudFront CDN domain name"
}

output "media_bucket_name" {
  value       = module.s3_cdn.bucket_id
  description = "Staging S3 media assets bucket name"
}

