import sqlite3
import pandas as pd


class messageManager():
    def __init__(self, dbname) -> None:
        self.dbname = dbname

    def get_messages(self):
        sql = "SELECT * FROM messages ORDER BY created_at DESC LIMIT 100;"

        conn = sqlite3.connect(self.dbname)
        df_message = pd.read_sql_query(sql, conn)
        conn.close()

        return df_message

    def post_messages(self, msg):
        sql = "INSERT INTO messages(username, text) VALUES(?,?)"
        taple = (msg.username, msg.text)

        conn = sqlite3.connect(self.dbname)
        # SQLiteを操作するためのカーソルを作成
        cur = conn.cursor()
        cur.execute(sql, taple)
        conn.commit()
        conn.close()

        return self.get_messages()

    def create_message_table(self):
        conn = sqlite3.connect(self.dbname)
        # SQLiteを操作するためのカーソルを作成
        cur = conn.cursor()
        # テーブルの作成
        cur.execute(
            'CREATE TABLE messages ('
            ' id INTEGER PRIMARY KEY AUTOINCREMENT,'
            ' username STRING, '
            ' text STRING, '
            ' created_at DATETIME DEFAULT CURRENT_TIMESTAMP)'
        )
        conn.close()
