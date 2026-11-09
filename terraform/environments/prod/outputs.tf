output "vpc_id" {
  value       = module.vpc.vpc_id
  description = "Production VPC ID"
}

output "db_endpoint" {
  value       = module.rds.endpoint
  description = "Production RDS endpoint"
}

output "redis_endpoint" {
  value       = module.elasticache.primary_endpoint_address
  description = "Production Redis primary endpoint"
}

output "eks_cluster_endpoint" {
  value       = module.eks.cluster_endpoint
  description = "Production EKS API cluster endpoint"
}

output "cdn_domain_name" {
  value       = module.s3_cdn.cloudfront_domain_name
  description = "Production CloudFront CDN domain name"
}

