from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class JobBase(BaseModel):
    title: str = Field(..., examples=["Backend Developer"])
    salary: int = Field(..., examples=[850000])
    description: Optional[str] = Field(None, examples=["Build FastAPI services and REST APIs."])
    company_id: int = Field(..., examples=[1])


class JobCreate(JobBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "Backend Developer",
                "salary": 850000,
                "description": "Build FastAPI services and REST APIs.",
                "company_id": 1,
            }
        }
    )


class JobUpdate(JobBase):
    title: Optional[str] = None
    salary: Optional[int] = None
    description: Optional[str] = None
    company_id: Optional[int] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "Senior Backend Developer",
                "salary": 1200000,
                "description": "Lead API development and mentor junior developers.",
                "company_id": 1,
            }
        }
    )


class JobResponse(JobBase):
    id: int
    company_id: int

    model_config = ConfigDict(from_attributes=True)
