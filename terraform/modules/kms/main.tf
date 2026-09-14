terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_kms_key" "master" {
  description             = "KMS Key for ${var.environment} EcivreS secrets and database encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = merge(var.tags, { Name = "${var.environment}-ecivres-kms" })
}

resource "aws_kms_alias" "alias" {
  name          = "alias/${var.environment}-ecivres-kms-key"
  target_key_id = aws_kms_key.master.key_id
}
