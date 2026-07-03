from datetime import datetime, timedelta
import os

from dotenv import load_dotenv
from fastapi import HTTPException
from jose import jwt
from sqlalchemy.orm import Session

from models.users import User

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY") or "dev-secret-key-change-me"
ALGORITHM = os.getenv("ALGORITHM") or "HS256"


def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=2)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, key=SECRET_KEY, algorithm=ALGORITHM)


def verify_access_token(token: str, db: Session):
    try:
        payload = jwt.decode(token, key=SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    current_user = db.query(User).filter(User.id == int(user_id)).first()
    if not current_user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return current_user
