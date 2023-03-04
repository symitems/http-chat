import os


class Config:
    def __init__(self):
        self.stage = os.getenv("STAGE")
        self.secret_key = os.getenv("SECRET", default="my-secret")
        self.github_client_id = os.getenv("GITHUB_CLIENT_ID")
        self.github_client_secret = os.getenv("GITHUB_CLIENT_SECRET")
        self.google_client_id = os.getenv("GOOGLE_CLIENT_ID")
        self.google_client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        self.ui_origin = os.getenv("UI_ORIGIN")

        self.pg_conf = {
            "host": os.getenv("PG_HOST"),
            "port": os.getenv("PG_PORT", default="5432"),
            "database": os.getenv("PG_DATABASE"),
            "user": os.getenv("PG_USER"),
            "password": os.getenv("PG_PASSWORD"),
        }


config = Config()
