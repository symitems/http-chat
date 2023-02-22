from fastapi import Depends, APIRouter
from pydantic import BaseModel

from .message_manager import message_manager
from helper.auth_helper import get_current_user


class Msg(BaseModel):
    username: str | None
    text: str


class MessageController:
    def __init__(self):
        self.router = APIRouter()
        self.router.add_api_route(
            "/messages/", self.get_item, methods=["GET"])
        self.router.add_api_route(
            "/messages/", self.post_item, methods=["POST"])
        self.router.add_api_route(
            "/messages/", self.delete_all, methods=["DELETE"])

    def get_item(self, _: str = Depends(get_current_user)):
        df_msg = message_manager.get_messages()
        return df_msg.to_dict("records")

    def post_item(self, msg: Msg,
                  current_user: str = Depends(get_current_user)):
        msg.username = current_user
        df_msg = message_manager.post_messages(msg)
        return df_msg.to_dict("records")

    def delete_all(self, _: str = Depends(get_current_user)):
        df_msg = message_manager.delete_messages()
        return df_msg.to_dict("records")
