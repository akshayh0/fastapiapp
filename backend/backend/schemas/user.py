from pydantic import BaseModel, ConfigDict, Field


class UserBase(BaseModel):
    username: str = Field(..., examples=["akshay_hr"])
    email: str = Field(..., examples=["akshay.hr@example.com"])
    password: str = Field(..., examples=["StrongPass123"])
    role: str = Field("Candidate", examples=["admin"])


class UserCreate(UserBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "username": "akshay_hr",
                "email": "akshay.hr@example.com",
                "password": "StrongPass123",
                "role": "admin",
            }
        }
    )


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str

    model_config = ConfigDict(from_attributes=True)


class Login_User(BaseModel):
    email: str = Field(..., examples=["akshay.hr@example.com"])
    password: str = Field(..., examples=["StrongPass123"])

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "akshay.hr@example.com",
                "password": "StrongPass123",
            }
        }
    )
