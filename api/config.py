import os

DB_URL_FORMAT = "{dialect}://{username}:{password}@{host}:{port}/{database}"


class Config:
    def __init__(self):
        self.stage = os.getenv("STAGE")
        self.log_level = os.getenv("LOG_LEVEL", default="INFO")
        self.secret_key = os.getenv("SECRET", default="my-secret")
        self.github_client_id = os.getenv("GITHUB_CLIENT_ID")
        self.github_client_secret = os.getenv("GITHUB_CLIENT_SECRET")
        self.google_client_id = os.getenv("GOOGLE_CLIENT_ID")
        self.google_client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        self.ui_origin = os.getenv("UI_ORIGIN")
        self.s3_endpoint = os.getenv("S3_ENDPOINT")
        self.s3_endpoint_frontend = os.getenv("S3_ENDPOINT_FE")
        self.s3_bucket_name = os.getenv("S3_BUCKET_NAME")
        self.aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
        self.aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        self.aws_region = os.getenv("AWS_REGION")
        self.faker_enabled = os.getenv("FAKER_ENABLED", default=None)
        self.faker_openai_apikey = os.getenv("FAKER_OPENAI_APIKEY", default=None)
        self.faker_trigger_probability = float(
            os.getenv("FAKER_TRIGGER_PROBABILITY", default="0.1")
        )
        self.faker_interval_seconds = int(
            os.getenv("FAKER_INTERVAL_SECONDS", default="21")
        )
        self.faker_language = os.getenv("FAKER_LANGUAGE", default="Japanese")

        if os.getenv("PG_HOST"):
            self.db_type = "postgresql"
            db_conf = {
                "dialect": "postgresql",
                "host": os.getenv("PG_HOST"),
                "port": os.getenv("PG_PORT", default="5432"),
                "database": os.getenv("PG_DATABASE"),
                "username": os.getenv("PG_USER"),
                "password": os.getenv("PG_PASSWORD"),
            }
            self.db_url = DB_URL_FORMAT.format_map(db_conf)

        elif os.getenv("MYSQL_HOST"):
            self.db_type = "mysql"
            db_conf = {
                "dialect": "mysql",
                "host": os.getenv("MYSQL_HOST"),
                "port": os.getenv("MYSQL_PORT", default="3306"),
                "database": os.getenv("MYSQL_DATABASE"),
                "username": os.getenv("MYSQL_USER"),
                "password": os.getenv("MYSQL_PASSWORD"),
            }
            self.db_url = DB_URL_FORMAT.format_map(db_conf)

        else:
            self.db_type = "sqlite"
            self.db_url = "sqlite:///sqlite.db"
        print(self)


config = Config()
