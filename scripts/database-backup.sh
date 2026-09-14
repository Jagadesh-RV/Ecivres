#!/usr/bin/env bash
set -eo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/tmp/db_backups"
DB_NAME=${DB_NAME:-"ecivres_prod"}
S3_BUCKET=${S3_BUCKET:-"s3://ecivres-db-backups-prod"}

mkdir -p ${BACKUP_DIR}
FILE_NAME="ecivres_dump_${TIMESTAMP}.sql.gz"
FULL_PATH="${BACKUP_DIR}/${FILE_NAME}"

echo "Starting PostgreSQL backup for ${DB_NAME} at ${TIMESTAMP}..."
pg_dump -h ${DB_HOST:-"localhost"} -U ${DB_USER:-"ecivres_admin"} ${DB_NAME} | gzip > ${FULL_PATH}

echo "Uploading dump to S3 ${S3_BUCKET}/${FILE_NAME}..."
aws s3 cp ${FULL_PATH} "${S3_BUCKET}/${FILE_NAME}" --storage-class STANDARD_IA

rm -f ${FULL_PATH}
echo "PostgreSQL backup completed successfully."
