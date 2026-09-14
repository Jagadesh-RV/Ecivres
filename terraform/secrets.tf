resource "aws_secretsmanager_secret" "database_credentials" {
  name                    = "ecivres/production/database"
  recovery_window_in_days = 7

  tags = {
    Name = "ecivres-db-credentials"
  }
}

resource "aws_secretsmanager_secret_version" "database_credentials_val" {
  secret_id = aws_secretsmanager_secret.database_credentials.id
  secret_string = jsonencode({
    username = "ecivres_admin"
    password = "SuperSecureProductionPassword2026!"
    engine   = "postgres"
    port     = 5432
  })
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
