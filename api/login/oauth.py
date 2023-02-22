from datetime import datetime, timedelta
from typing import Dict
from fastapi import HTTPException, Response, APIRouter
from pydantic import BaseModel
import jwt
import requests

from config import config
from logger import logger
from .user_manager import user_manager

# STAGEがdevelopでない場合、認証CookieをHTTPで利用できないよう制限
use_https = True
if config.stage == "develop":
    use_https = False


class LoginOauthRequest(BaseModel):
    code: str


class GithubOauth:
    def __init__(self):
        self.router = APIRouter()
        self.provider = "github"
        self.url_user = "https://api.github.com/user"
        self.url_token = "https://github.com/login/oauth/access_token"
        self.client_id = config.client_id
        self.client_secret = config.client_secret
        self.secret_key = config.secret_key
        self.router.add_api_route(
            "/login/oauth/github", self.login, methods=["POST"])

    def login(self, request: LoginOauthRequest, response: Response) -> Dict:
        code = request.code
        # 認証が成功した場合は、JWTトークンを生成して返却します。
        try:
            token = self.getToken(code)
            user = self.getUser(token)
            logger.debug(user)
            github_id = str(user["id"])
            username = user["login"]
            avatar_url = user["avatar_url"]
            user_manager.update_userinfo(
                self.provider, github_id, username, avatar_url)

            payload = {
                "sub": username,
                "exp": datetime.utcnow() + timedelta(hours=1),
            }
            token = jwt.encode(payload, self.secret_key, algorithm='HS256')

            # JWTトークンをcookieとして設定します。
            response.set_cookie(key="access_token", value=token,
                                httponly=True, samesite="Strict",
                                secure=use_https)

            return {
                "message": "login successfully",
                "username": username,
                "avatar_url": avatar_url,
            }

        except Exception as e:
            logger.error(e)
            raise HTTPException(status_code=401, detail="Invalid code")

    def getToken(self, code: str) -> str:
        headers = {"Content-Type": "application/json",
                   "Accept": "application/json"}
        data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "code": code
        }

        response = requests.post(
            self.url_token, headers=headers, json=data).json()

        if "access_token" not in response:
            logger.info("Login request is invalid")
            logger.info(f"response: {response}")
            raise Exception(
                'There is no "access_token" in response from Github')

        return response["access_token"]

    def getUser(self, token: str) -> str:
        headers = {
            "Authorization": "Bearer {}".format(token),
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }

        response = requests.get(self.url_user, headers=headers).json()
        return response
