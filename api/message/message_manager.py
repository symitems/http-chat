from fastapi import HTTPException
import pandas as pd
from sqlalchemy import select
from sqlalchemy.orm import Session

from models import Message, User, engine
from login.user_manager import user_manager


class MessageManager:
    def authorize(self, current_user: str):
        with Session(engine) as session:
            user_selected = session.query(User).filter(
                User.username == current_user).first()
        if user_selected:
            if user_selected.is_active:
                return
        raise HTTPException(
            status_code=403,
            detail=f"Access Denied: {current_user} not activated"
        )

    def get_messages(self):
        query = (
            select(User.username, Message.text, Message.created_at)
            .join(Message, Message.user_id == User.id)
            .order_by(Message.created_at.desc())
            .limit(100)
        )

        with engine.connect() as conn:
            df_message = pd.read_sql_query(sql=query, con=conn)

        df_message = df_message.rename(
            columns={'A': 'Col_1'}, index={'ONE': 'Row_1'})

        return df_message

    def post_messages(self, msg):
        user_id = user_manager.get_user_id(username=msg.username)
        message = Message(text=msg.text, user_id=user_id)

        with Session(engine) as session:
            session.add(message)
            session.flush()
            session.commit()

        return self.get_messages()

    def delete_messages(self):
        with Session(engine) as session:
            session.query(Message).delete()
            session.commit()

        return self.get_messages()


message_manager = MessageManager()
