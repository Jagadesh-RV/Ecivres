# Amazon S3 CORS & Presigned URL Expiration Policy

## Presigned URL Expirations
- **PUT Upload URLs**: 15 minutes (900 seconds)
- **GET Private Document Read URLs**: 60 minutes (3600 seconds)

## S3 Bucket CORS Configuration
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": ["https://ecivres.com", "https://*.ecivres.com", "http://localhost:3000"],
    "ExposeHeaders": ["ETag"]
  }
]
```
