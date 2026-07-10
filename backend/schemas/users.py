from pydantic import BaseModel, ConfigDict

class UserBase(BaseModel):
    name: str
    email: str
    password: str
    role: str

class UserCreate(UserBase):
    pass

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    model_config = ConfigDict(from_attributes=True)
        
class Login_User(BaseModel):
    email: str
    password: str