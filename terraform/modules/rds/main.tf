terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_db_subnet_group" "rds" {
  name        = "${var.environment}-rds-subnet-group"
  subnet_ids  = var.subnet_ids
  description = "RDS Subnet Group for ${var.environment}"

  tags = var.tags
}

resource "aws_db_parameter_group" "pg16" {
  name   = "${var.environment}-pg16-params"
  family = "postgres16"

  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements"
  }

  parameter {
    name  = "track_io_timing"
    value = "1"
  }

  tags = var.tags
}

resource "aws_db_instance" "postgres" {
  identifier                  = "${var.environment}-ecivres-db"
  engine                      = "postgres"
  engine_version              = "16.1"
  instance_class              = var.instance_class
  allocated_storage           = var.allocated_storage
  max_allocated_storage       = var.max_allocated_storage
  storage_type                = "gp3"
  storage_encrypted           = true
  multi_az                    = var.multi_az
  db_subnet_group_name        = aws_db_subnet_group.rds.name
  vpc_security_group_ids      = var.security_group_ids
  parameter_group_name        = aws_db_parameter_group.pg16.name
  db_name                     = var.db_name
  username                    = var.db_username
  password                    = var.db_password
  backup_retention_period     = var.backup_retention_days
  backup_window               = "03:00-04:00"
  maintenance_window          = "Mon:04:00-Mon:05:00"
  deletion_protection         = var.environment == "prod" ? true : false
  skip_final_snapshot         = var.environment == "prod" ? false : true
  final_snapshot_identifier   = "${var.environment}-ecivres-db-final-snapshot"

  tags = var.tags
}
