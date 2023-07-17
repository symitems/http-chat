from fastapi import FastAPI

from login.oauth import GithubOauth, GoogleOauth
from message.controller import MessageController
from jobs.scheduler import Scheduler

app = FastAPI()

app.include_router(GithubOauth().router)
app.include_router(GoogleOauth().router)
app.include_router(MessageController().router)


@app.get("/")
def read_root():
    return {"status": "ok"}


@app.on_event("startup")
def init_scheduler():
    scheduler = Scheduler()
    scheduler.start()
