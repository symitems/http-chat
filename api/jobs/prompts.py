from sqlalchemy import select

from models import User, Message, engine
from logger import logger
from config import config

PROMPT_TEMPLATE = """
== Situation ==
- This is a rollplay. You are "{user}", a friend of the members.
- Send a latest single line message to the Chat Room as {user}.
- You shoud consider {user}'s personality and emotion based on the chat history
- Refer to the previous messages so to send a message with a similar length as the messages from the other members.
- You must speak {faker_language}

== Chat Room ==
{history_lines}

== Format ==
{user}:
"""


def generate_rp_prompt(role: str) -> str:
    history = get_history()
    role = cleansing_username(role)
    return PROMPT_TEMPLATE.format_map(
        {
            "user": role,
            "history_lines": history,
            "faker_language": config.faker_language,
        }
    )


def get_history() -> str:
    history = "(Oldest)\n"
    query = (
        select(
            User.username,
            Message.text,
        )
        .join(Message, Message.user_id == User.id)
        .order_by(Message.created_at.asc())
        .limit(100)
    )

    with engine.connect() as conn:
        result = conn.execute(query)

    for row in result:
        username = cleansing_username(row.username)
        history += f"{username}: {row.text}\n"
    logger.debug(history)
    history = "(Latest)"

    return history


def cleansing_username(username_org: str) -> str:
    return username_org.split(" @ ")[0]
