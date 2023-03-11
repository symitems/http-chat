from sqlalchemy import create_engine, Engine
from sqlalchemy.orm import DeclarativeBase

from config import config
from logger import logger


class Base(DeclarativeBase):
    pass


def get_engine() -> Engine:
    db_type = config.db_type
    db_url = config.db_url

    if db_type == "sqlite":
        logger.warn("DB parameter is not set. Use SQLite.")

    return create_engine(db_url)
