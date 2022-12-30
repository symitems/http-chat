import os
import sqlite3
from typing import Dict
import pandas as pd
import psycopg2

# SQLite DB file (Ignored when using PostgresQL)
db_sqlite = 'main.db'


class messageManager():
    def __init__(self) -> None:
        self.pg_conf = get_pg_conf()
        self.create_message_table()

    def get_conn(self):
        if self.pg_conf:
            return psycopg2.connect(**self.pg_conf)
        else:
            # Use SQLite instead of PostgreSQL
            return sqlite3.connect(db_sqlite)

    def get_messages(self):
        query = "SELECT * FROM messages ORDER BY created_at DESC LIMIT 100;"

        conn = self.get_conn()
        df_message = pd.read_sql_query(query, conn)
        conn.close()

        return df_message

    def post_messages(self, msg):
        if self.pg_conf:
            query = "INSERT INTO messages (username, text) VALUES (%s, %s)"
        else:
            query = "INSERT INTO messages(username, text) VALUES(?,?)"
        taple = (msg.username, msg.text)

        conn = self.get_conn()
        cur = conn.cursor()
        cur.execute(query, taple)
        conn.commit()
        conn.close()

        return self.get_messages()

    def delete_messages(self):
        query = "DELETE FROM messages"

        conn = self.get_conn()
        cur = conn.cursor()
        cur.execute(query)
        conn.commit()
        conn.close()

        return self.get_messages()

    def create_message_table(self):
        conn = self.get_conn()
        cur = conn.cursor()
        if self.pg_conf:
            query = "CREATE TABLE IF NOT EXISTS messages ("\
                "id SERIAL PRIMARY KEY,"\
                "username TEXT,"\
                "text TEXT,"\
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"\
                ");"
        else:
            query = "CREATE TABLE IF NOT EXISTS messages ("\
                "id INTEGER PRIMARY KEY AUTOINCREMENT,"\
                "username TEXT,"\
                "text TEXT,"\
                "created_at DATETIME DEFAULT CURRENT_TIMESTAMP"\
                ");"

        cur.execute(query)
        conn.commit()
        conn.close()


def get_pg_conf() -> Dict:
    pg_envs = {}
    pg_envs["host"] = os.getenv("PG_HOST")
    if pg_envs["host"] is None:
        # Use SQLite instead of PostgreSQL
        return {}
    pg_envs["port"] = os.getenv("PG_PORT", default="5432")
    pg_envs["database"] = os.getenv("PG_DATABASE")
    pg_envs["user"] = os.getenv("PG_USER")
    pg_envs["password"] = os.getenv("PG_PASSWORD")
    return pg_envs
