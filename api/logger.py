from logging import getLogger, CRITICAL, DEBUG, INFO, WARNING, ERROR
from config import config

levels = {
    "DEBUG": DEBUG,
    "INFO": INFO,
    "WARNING": WARNING,
    "ERROR": ERROR,
    "CRITICAL": CRITICAL,
}

logger = getLogger('uvicorn')
logger.setLevel(levels[config.log_level])
