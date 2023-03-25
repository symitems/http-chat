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


config = Config()
