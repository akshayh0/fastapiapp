from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class JobApplicationCreate(BaseModel):
    job_id: int

class JobApplicationResponse(BaseModel):
    id: int
    job_id: int
    user_id: int
    status: str
    applied_at: datetime
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    job_title: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

