resource "random_password" "master_db_password" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_secretsmanager_secret" "database_credentials" {
  name                    = "ecivres/production/database"
  recovery_window_in_days = 7
  kms_key_id              = aws_kms_key.master.key_id

  tags = {
    Name = "ecivres-db-credentials"
  }
}

resource "aws_secretsmanager_secret_version" "database_credentials_val" {
  secret_id = aws_secretsmanager_secret.database_credentials.id
  secret_string = jsonencode({
    username = "ecivres_admin"
    password = random_password.master_db_password.result
    engine   = "postgres"
    port     = 5432
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name                    = "ecivres/production/jwt"
  recovery_window_in_days = 7
}

resource "aws_ssm_parameter" "api_endpoint" {
  name  = "/ecivres/production/API_URL"
  type  = "String"
  value = "https://api.ecivres.com"
}
