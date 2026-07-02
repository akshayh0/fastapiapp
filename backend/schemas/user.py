from pydantic import BaseModel

class UserBase(BaseModel):
    username: str
    email: str
    password: str
    role: str


class UserCreate(UserBase):
    pass


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str

    class Config:
        form_attributes = True

class Login_User(BaseModel):
    email: str
    password: str