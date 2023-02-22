from typing import List, Optional
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base
from .message import Message


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(
        String(30), nullable=False, unique=True)
    avatar_url: Mapped[str] = mapped_column(Text)
    social_account_github: Mapped[Optional["SocialAccountGithub"]] = \
        relationship(back_populates="user")
    messages: Mapped[List["Message"]] = relationship()

    def __repr__(self) -> str:
        return "User(" \
            f"id={self.id!r}, " \
            f"username={self.username!r}, " \
            f"avator_url={self.avatar_url!r})"


class SocialAccountGithub(Base):
    __tablename__ = "social_accounts_github"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    social_id: Mapped[str] = mapped_column(String(40), unique=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(
        back_populates="social_account_github")

    def __repr__(self) -> str:
        return "SocialAccountGithub(" \
            f"id={self.id!r}, " \
            f"github_id={self.social_id!r}, " \
            f"user_id={self.user_id!r})"
