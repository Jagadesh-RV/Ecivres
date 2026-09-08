# Local S3 Emulator Setup with MinIO

## Running MinIO with Docker
```bash
docker run -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=minio_admin" \
  -e "MINIO_ROOT_PASSWORD=minio_password" \
  minio/minio server /data --console-address ":9001"
```

## S3 Configuration in Local `.env`
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=minio_admin
AWS_SECRET_ACCESS_KEY=minio_password
AWS_S3_BUCKET=ecivres-uploads
```
