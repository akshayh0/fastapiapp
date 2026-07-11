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
    is_approved: bool

    model_config = ConfigDict(from_attributes=True)

        
class Login_User(BaseModel):
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class ResetPasswordDirectRequest(BaseModel):
    name: str
    email: str
    new_password: str