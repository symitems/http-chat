from typing import Optional
from datetime import datetime
from sqlalchemy import func, ForeignKey, Integer, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Message(Base):
    __tablename__ = 'messages'
    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"))
    text: Mapped[str] = mapped_column(Text)
    image: Mapped[Optional["Image"]] = relationship(back_populates="message")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    def __repr__(self) -> str:
        return "Message(" \
            f"id={self.id!r}, "\
            f"user_id={self.user_id!r}, "\
            f"text={self.text!r}, "\
            f"created_at={self.created_at!r})"


class Image(Base):
    __tablename__ = 'images'
    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)
    upload_key: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    message_id: Mapped[int] = mapped_column(
        ForeignKey("messages.id", ondelete="CASCADE"), unique=True)
    message: Mapped["Message"] = relationship(back_populates="image")

    def __repr__(self) -> str:
        return "Image(" \
            f"id={self.id!r}, "\
            f"message_id={self.message_id!r}, "\
            f"upload_key={self.upload_key!r}, "\
            f"created_at={self.created_at!r})"
