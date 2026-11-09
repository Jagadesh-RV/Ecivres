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

output "redis_primary_endpoint" {
  value       = module.elasticache.primary_endpoint_address
  description = "Staging Redis cluster primary endpoint"
}

output "eks_cluster_id" {
  value       = module.eks.cluster_id
  description = "Staging EKS Cluster ID"
}

output "eks_cluster_endpoint" {
  value       = module.eks.cluster_endpoint
  description = "Staging EKS API server endpoint"
}

output "cdn_domain_name" {
  value       = module.s3_cdn.cloudfront_domain_name
  description = "Staging CloudFront CDN domain name"
}

output "media_bucket_name" {
  value       = module.s3_cdn.bucket_id
  description = "Staging S3 media assets bucket name"
}

