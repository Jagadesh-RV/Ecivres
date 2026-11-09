terraform {
  required_version = ">= 1.5.0"
  backend "s3" {
    bucket         = "ecivres-terraform-state-staging"
    key            = "staging/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "ecivres-terraform-locks-staging"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "EcivreS"
      ManagedBy   = "Terraform"
    }
  }
}

module "vpc" {
  source               = "../../modules/vpc"
  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  availability_zones   = var.availability_zones
  cluster_name         = "ecivres-${var.environment}-eks"
}

module "kms" {
  source      = "../../modules/kms"
  environment = var.environment
}

resource "aws_security_group" "db_sg" {
  name        = "ecivres-${var.environment}-db-sg"
  description = "Staging Database Security Group"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
    description = "PostgreSQL ingress from VPC"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "ecivres-${var.environment}-db-sg"
    Environment = var.environment
  }
}

resource "aws_security_group" "redis_sg" {
  name        = "ecivres-${var.environment}-redis-sg"
  description = "Staging Redis Security Group"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
    description = "Redis ingress from VPC"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "ecivres-${var.environment}-redis-sg"
    Environment = var.environment
  }
}

resource "aws_security_group" "eks_sg" {
  name        = "ecivres-${var.environment}-eks-sg"
  description = "Staging EKS Security Group"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS ingress"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "ecivres-${var.environment}-eks-sg"
    Environment = var.environment
  }
}

module "rds" {
  source                = "../../modules/rds"
  environment           = var.environment
  subnet_ids            = module.vpc.private_subnet_ids
  security_group_ids    = [aws_security_group.db_sg.id]
  instance_class        = var.db_instance_class
  allocated_storage      = 20
  max_allocated_storage  = 50
  multi_az              = false
  backup_retention_days = 7
  db_password           = var.db_password
}

module "elasticache" {
  source             = "../../modules/elasticache"
  environment        = var.environment
  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [aws_security_group.redis_sg.id]
  node_type          = var.redis_node_type
  num_cache_nodes    = 1
}

module "eks" {
  source             = "../../modules/eks"
  environment        = var.environment
  private_subnet_ids = module.vpc.private_subnet_ids
  security_group_ids = [aws_security_group.eks_sg.id]
  kubernetes_version = var.kubernetes_version
  min_size           = 1
  max_size           = 3
  desired_size       = 2
}

module "s3_cdn" {
  source      = "../../modules/s3_cdn"
  environment = var.environment
}

