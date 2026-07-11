from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False,default="Candidate")
    is_approved = Column(Boolean, default=False, nullable=False)

    applications = relationship("JobApplication", back_populates="user", cascade="all, delete-orphan")


    