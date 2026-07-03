from fastapi import Depends, HTTPException, OAuth2PasswordBearer,HTTPException
from database import get_db
from sqlalchemy import text
from sqlalchemy.orm import Session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
def get_current_user(token: str =Depends(oauth2_scheme),db: Session =Depends(get_db)):
    current_user =verify_token(token)
    if current_user is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return current_user
def role_required(role:list):
    def role_decorator(current_user= Depends(get_current_user)):
        if current_user.role not in role:
            raise HTTPException(status_code=403, detail="access denied")
        return current_user
    return role_decorator
