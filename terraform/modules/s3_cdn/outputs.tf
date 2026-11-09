output "bucket_id" {
  value       = aws_s3_bucket.assets.id
  description = "The ID of the S3 media bucket"
}

output "bucket_arn" {
  value       = aws_s3_bucket.assets.arn
  description = "The ARN of the S3 media bucket"
}

output "cloudfront_domain_name" {
  value       = aws_cloudfront_distribution.cdn.domain_name
  description = "The domain name of the CloudFront distribution"
}

output "cloudfront_arn" {
  value       = aws_cloudfront_distribution.cdn.arn
  description = "The ARN of the CloudFront distribution"
}

