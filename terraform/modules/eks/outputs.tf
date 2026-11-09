output "cluster_id" {
  value       = aws_eks_cluster.main.id
  description = "The ID of the EKS cluster"
}

output "cluster_endpoint" {
  value       = aws_eks_cluster.main.endpoint
  description = "The endpoint for your EKS Kubernetes API"
}

output "cluster_arn" {
  value       = aws_eks_cluster.main.arn
  description = "The Amazon Resource Name (ARN) of the cluster"
}

output "cluster_certificate_authority_data" {
  value       = aws_eks_cluster.main.certificate_authority[0].data
  description = "Base64 encoded certificate data required to communicate with your cluster"
}

