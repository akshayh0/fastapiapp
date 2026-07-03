from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from .job import JobResponse


class CompanyBase(BaseModel):
    name: Optional[str] = Field(None, examples=["TalentSpark"])
    email: Optional[str] = Field(None, examples=["hr@talentspark.com"])
    phone: Optional[str] = Field(None, examples=["9876543210"])
    location: Optional[str] = Field(None, examples=["Bengaluru"])


class CompanyCreate(CompanyBase):
    name: str
    email: str
    phone: str
    location: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "TalentSpark",
                "email": "hr@talentspark.com",
                "phone": "9876543210",
                "location": "Bengaluru",
            }
        }
    )


class CompanyUpdate(CompanyBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "TalentSpark Technologies",
                "email": "careers@talentspark.com",
                "phone": "9876543211",
                "location": "Hyderabad",
            }
        }
    )


class CompanyResponse(CompanyBase):
    id: int
    jobs: list[JobResponse]

    model_config = ConfigDict(from_attributes=True)
