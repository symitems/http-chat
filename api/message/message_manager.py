import sqlite3
import pandas as pd
import psycopg2

from config import config

# SQLite DB file (Ignored when using PostgresQL)
DB_SQLITE = 'main.db'


class MessageManager():
    # FIXME: SQLのべた書きを避ける

    def __init__(self) -> None:
        if config.pg_conf["host"]:
            self.db_type = "pg"
        else:
            self.db_type = "sqlite"
        self.create_message_table()

    def get_conn(self):
        if self.db_type == "pg":
            return psycopg2.connect(**config.pg_conf)
        else:
            # Use SQLite instead of PostgreSQL
            return sqlite3.connect(DB_SQLITE)

    def get_messages(self):
        query = "SELECT * FROM messages ORDER BY created_at DESC LIMIT 100;"

        conn = self.get_conn()
        df_message = pd.read_sql_query(query, conn)
        conn.close()

        return df_message

    def post_messages(self, msg):
        if self.db_type == "pg":
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
        if self.db_type == "pg":
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
