variable "aws_region" {
  type        = string
  description = "AWS region for staging deployment"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Environment identifier"
  default     = "staging"
}

variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR block for staging"
  default     = "10.50.0.0/16"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "Public subnet CIDR blocks"
  default     = ["10.50.1.0/24", "10.50.2.0/24", "10.50.3.0/24"]
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "Private subnet CIDR blocks"
  default     = ["10.50.10.0/24", "10.50.20.0/24", "10.50.30.0/24"]
}

variable "availability_zones" {
  type        = list(string)
  description = "Availability zones for staging deployment"
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "db_instance_class" {
  type        = string
  description = "Database instance size for staging"
  default     = "db.t4g.small"
}

variable "db_password" {
  type        = string
  description = "Staging PostgreSQL master password"
  sensitive   = true
}

variable "redis_node_type" {
  type        = string
  description = "Redis cache instance size for staging"
  default     = "cache.t4g.micro"
}

variable "kubernetes_version" {
  type        = string
  description = "EKS Kubernetes control plane version"
  default     = "1.29"
}

variable "cost_center" {
  type        = string
  description = "Cost allocation center for staging infrastructure"
  default     = "engineering-staging"
}

variable "owner" {
  type        = string
  description = "Platform team owner tag"
  default     = "platform-ops@ecivres.com"
}

