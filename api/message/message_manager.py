from datetime import datetime
from fastapi import HTTPException
import pandas as pd
from sqlalchemy import select
from sqlalchemy.orm import Session

from models import Message, Image, User, engine
from login.user_manager import user_manager
from helper.image_helper import get_s3_url, upload_s3


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
            select(User.username, User.avatar_url,
                   Message.text, Message.created_at,
                   Image.upload_key)
            .join(Message, Message.user_id == User.id)
            .join(Image, Message.id == Image.message_id, isouter=True)
            .order_by(Message.created_at.desc())
            .limit(100)
        )

        with engine.connect() as conn:
            df_message = pd.read_sql_query(sql=query, con=conn)

        df_message = df_message.rename(
            columns={'A': 'Col_1'}, index={'ONE': 'Row_1'})

        df_message['img_url'] = df_message['upload_key'].apply(get_s3_url)
        del df_message['upload_key']

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

    def post_image(self, username, file):
        user_id = user_manager.get_user_id(username=username)

        dt = datetime.now().strftime('%Y%m%d%H%M%S')
        upload_key = f"{dt}-{file.filename}"

        new_message = Message(text="", user_id=user_id)
        new_image = Image(upload_key=upload_key, message=new_message)

        with Session(engine) as session:
            try:
                session.add(new_message)
                session.add(new_image)
                upload_s3(upload_key, file.file)
                session.flush()
                session.commit()

            except Exception as e:
                session.rollback()
                raise e

        return self.get_messages()


message_manager = MessageManager()
