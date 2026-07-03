from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import get_db
from utils.token import verify_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    current_user = verify_access_token(token, db)
    if current_user is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return current_user


def role_required(required_role):
    def role_decorator(current_user=Depends(get_current_user)):
        roles = required_role if isinstance(required_role, list) else [required_role]
        if current_user.role not in roles:
            raise HTTPException(status_code=403, detail="Forbidden")
        return current_user
    return role_decorator
