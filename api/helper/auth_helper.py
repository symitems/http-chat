import jwt

from fastapi import HTTPException, Request

from config import config


def get_current_user(request: Request):
    access_token = request.cookies.get("access_token")
    if access_token is not None:
        try:
            payload = jwt.decode(
                access_token, config.secret_key, algorithms=['HS256'])
            return payload["sub"]
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid access_token")
    else:
        raise HTTPException(
            status_code=401, detail="Access_token is not present in cookie")
