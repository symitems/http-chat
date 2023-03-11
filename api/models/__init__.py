from sqlalchemy import Engine
from .base import Base, get_engine
from .message import Message
from .user import User, SocialAccountGithub, SocialAccountGoogle

engine: Engine = get_engine()

Base.metadata.create_all(engine)

__all__ = ["Message", "User", "SocialAccountGithub", "SocialAccountGoogle"]
