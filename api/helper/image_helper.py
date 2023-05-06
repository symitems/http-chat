from config import config
import boto3

S3_BUCKET_NAME = config.s3_bucket_name
ENDPOINT = config.s3_endpoint
ENDPOINT_FE = config.s3_endpoint_frontend or ENDPOINT

s3 = boto3.client(
    "s3",
    endpoint_url=ENDPOINT,
    aws_access_key_id=config.aws_access_key_id,
    aws_secret_access_key=config.aws_secret_access_key,
    region_name=config.aws_region
)


def upload_s3(key, file):
    s3.upload_fileobj(file, S3_BUCKET_NAME, key)


# Usage: df['url'] = df['upload_key'].apply(get_s3_url)
def get_s3_url(upload_key):
    if upload_key:
        return f"{ENDPOINT_FE}/{S3_BUCKET_NAME}/{upload_key}"
    return None
