resource "aws_db_subnet_group" "rds" {
  name       = "ecivres-rds-subnet-group"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id, aws_subnet.private_c.id]

  tags = {
    Name = "ecivres-rds-subnet-group"
  }
}

resource "aws_security_group" "rds" {
  name        = "ecivres-rds-sg"
  description = "Allow PostgreSQL access from private subnets"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ecivres-rds-security-group"
  }
}

resource "aws_db_instance" "postgresql" {
  identifier             = "ecivres-postgres-production"
  engine                 = "postgres"
  engine_version         = "15.4"
  instance_class         = "db.m6g.xlarge"
  allocated_storage      = 100
  max_allocated_storage  = 1000
  storage_type           = "gp3"
  multi_az               = true
  db_name                = "ecivres"
  username               = "ecivres_admin"
  password               = "SuperSecureProductionPassword2026!"
  db_subnet_group_name   = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot    = false

  backup_retention_period = 30
  backup_window           = "03:00-04:00"
  maintenance_window      = "Sun:04:30-Sun:05:30"

  tags = {
    Name = "ecivres-postgres-production"
  }
}
