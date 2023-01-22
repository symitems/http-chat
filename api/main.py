from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from login.oauth import GithubOauth
from message.controller import MessageController
from config import config


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.origin],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)

app.include_router(GithubOauth().router)
app.include_router(MessageController().router)


@app.get("/")
def read_root():
    return {"status": config.origin}
