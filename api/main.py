import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from modules import messageManager


class Msg(BaseModel):
    username: str
    text: str


dbname = 'main.db'
message_manager = messageManager(dbname)

if not os.path.isfile(dbname):
    message_manager.create_message_table()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    # get frontend origin from env, or use "http://localhost:3000" for debug
    allow_origins=[os.getenv("UI_ORIGIN", default="http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


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