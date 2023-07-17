import random

from sqlalchemy import func, select
from config import config
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from logger import logger
import openai

from models import User, engine
from message.message_manager import message_manager
from .prompts import generate_rp_prompt


class Scheduler(BackgroundScheduler):
    def __init__(self):
        super().__init__()

        if config.faker_enabled:
            self.openai_apikey = config.faker_openai_apikey
            self.prob = config.faker_trigger_probability
            self.interval = config.faker_interval_seconds
            self.add_job(self.send_fake_msg, "cron", second=f"*/{self.interval}")
            if self.openai_apikey:
                openai.api_key = self.openai_apikey

    def send_fake_msg(self):
        logger.debug("send_fake_msg kicked")
        # filter
        if random.random() > self.prob:
            return
        query = select(User.username).order_by(func.random()).limit(1)
        with engine.connect() as conn:
            random_user = conn.execute(query).first()
        logger.debug(f"{random_user=}")

        prompt = generate_rp_prompt(role=random_user.username)

        # generate fake message
        if self.openai_apikey:
            fake_msg = self.get_fake_msg(prompt, random_user.username)
        else:
            fake_msg = "[DEBUG] fake message"

        logger.debug(f"{fake_msg=}")
        message_manager.post_messages(username=random_user.username, text=fake_msg)

    def get_fake_msg(self, prompt: str, username: str) -> str:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt},
            ],
        )
        msg: str = response.choices[0].message.content
        if msg.startswith(msg):
            return msg.replace(f"{username}: ", "", 1)
        else:
            return None
