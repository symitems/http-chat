from datetime import datetime
from sqlalchemy import func, ForeignKey, Integer, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class Message(Base):
    __tablename__ = 'messages'
    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    text: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    def __repr__(self) -> str:
        return "Message(" \
            f"id={self.id!r}, "\
            f"user_id={self.user_id!r}, "\
            f"text={self.text!r}, "\
            f"created_at={self.created_at!r})"
