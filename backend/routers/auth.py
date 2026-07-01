from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.users import User
from schemas.user import UserCreate,UserResponse
from database import get_db
from utils.security import hash_password,verify_password

router =APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register",response_model=UserResponse)
def register(user:UserCreate,db:Session=Depends(get_db)):
    existing_user = db.query(User).filter((User.username == user.username) | (User.email == user.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    hashed_password = hash_password(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login",response_model=UserResponse)
def login(user:UserCreate,db:Session=Depends(get_db)):
    existing_user = db.query(User).filter((User.username == user.username) | (User.email == user.email)).first()
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid username or email")
    if not verify_password(user.password, existing_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    return existing_user