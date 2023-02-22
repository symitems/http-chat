from sqlalchemy import select
from sqlalchemy.orm import Session

from models import engine, User, SocialAccountGithub
from logger import logger

social_account_tables = {
    "github": SocialAccountGithub,
}


class UserManager:
    def update_userinfo(self, provider: str,
                        social_id: str, username: str, avatar_url: str):
        SocialAccount = social_account_tables[provider]

        with Session(engine) as session:
            user_selected = session.query(SocialAccount).filter(
                SocialAccount.social_id == social_id).first()
        if user_selected:
            logger.debug(f"{social_id=} exists in the database.")
        else:
            new_user = User(username=username, avatar_url=avatar_url)
            new_social_account = SocialAccount(
                social_id=social_id, user=new_user)
            with Session(engine) as session:
                session.add(new_user)
                session.add(new_social_account)
                session.flush()
                session.commit()

    def get_user_id(self, username: str) -> int:
        q_select_user_id = select(User.id).where(
            User.username == username)

        with engine.connect() as conn:
            result = conn.execute(q_select_user_id)

        row = result.fetchone()
        if row is None:
            logger.error("Failed to post message")
            logger.error(f"User not exsists: {username=}")
            raise Exception
        if len(row) > 1:
            logger.warn("Multiple users has same username")

        return row[0]


user_manager = UserManager()
