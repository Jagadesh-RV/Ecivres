output "key_arn" {
  value       = aws_kms_key.master.arn
  description = "The ARN of the KMS key"
}

output "key_id" {
  value       = aws_kms_key.master.key_id
  description = "The ID of the KMS key"
}

output "alias_arn" {
  value       = aws_kms_alias.alias.arn
  description = "The ARN of the KMS alias"
}

