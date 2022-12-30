import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from modules import messageManager


class Msg(BaseModel):
    username: str
    text: str


message_manager = messageManager()


app = FastAPI()
origin = os.getenv("UI_ORIGIN", default="http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    # get frontend origin from env, or use "http://localhost:3000" for debug
    allow_origins=[origin],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"UI_ORIGIN": origin}


@app.get("/messages/")
def read_item():
    df_msg = message_manager.get_messages()
    return df_msg.to_dict("records")


@app.post("/messages/")
def post_item(msg: Msg):
    df_msg = message_manager.post_messages(msg)
    return df_msg.to_dict("records")


@app.delete("/messages/")
def delete_all():
    df_msg = message_manager.delete_messages()
    return df_msg.to_dict("records")
