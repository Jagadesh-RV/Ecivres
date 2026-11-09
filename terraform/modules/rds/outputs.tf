output "endpoint" {
  value       = aws_db_instance.postgres.endpoint
  description = "The connection endpoint for the RDS instance"
}

output "address" {
  value       = aws_db_instance.postgres.address
  description = "The address of the RDS instance"
}

output "port" {
  value       = aws_db_instance.postgres.port
  description = "The database port"
}

output "db_name" {
  value       = aws_db_instance.postgres.db_name
  description = "The database name"
}

output "arn" {
  value       = aws_db_instance.postgres.arn
  description = "The ARN of the RDS instance"
}

