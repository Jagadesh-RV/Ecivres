terraform {
  required_version = ">= 1.5.0"
  backend "s3" {
    bucket         = "ecivres-terraform-state-prod"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "ecivres-terraform-locks-prod"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source              = "../../modules/vpc"
  environment         = "prod"
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  availability_zones  = var.availability_zones
  cluster_name        = "ecivres-prod-eks"
}

module "kms" {
  source      = "../../modules/kms"
  environment = "prod"
}

module "rds" {
  source             = "../../modules/rds"
  environment        = "prod"
  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [aws_security_group.db_sg.id]
  db_password        = var.db_password
}

module "elasticache" {
  source             = "../../modules/elasticache"
  environment        = "prod"
  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [aws_security_group.redis_sg.id]
}

module "eks" {
  source             = "../../modules/eks"
  environment        = "prod"
  private_subnet_ids = module.vpc.private_subnet_ids
  security_group_ids = [aws_security_group.eks_sg.id]
}

module "s3_cdn" {
  source      = "../../modules/s3_cdn"
  environment = "prod"
}

resource "aws_security_group" "db_sg" {
  name        = "ecivres-prod-db-sg"
  description = "Database Security Group"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }
}

resource "aws_security_group" "redis_sg" {
  name        = "ecivres-prod-redis-sg"
  description = "Redis Security Group"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }
}

resource "aws_security_group" "eks_sg" {
  name        = "ecivres-prod-eks-sg"
  description = "EKS Security Group"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
