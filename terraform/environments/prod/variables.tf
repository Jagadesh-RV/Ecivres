variable "aws_region" {
  type        = string
  description = "AWS region for production deployment"
  default     = "us-east-1"
}

variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR block for production"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "Public subnet CIDR blocks"
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "Private subnet CIDR blocks"
}

variable "availability_zones" {
  type        = list(string)
  description = "Availability zones for multi-AZ deployment"
}

variable "db_password" {
  type        = string
  description = "Production PostgreSQL master password"
  sensitive   = true
}

