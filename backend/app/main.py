from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from models import job as job_model
from models import company as company_model
from models import users as user_model

from routers import auth, company, job
from routers.chat import router as chat_router

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create Database Tables
Base.metadata.create_all(bind=engine)

# Include Routers
app.include_router(auth.router)
app.include_router(company.router)
app.include_router(job.router)
app.include_router(chat_router)

# Root APIs
@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/about")
def read_about():
    return {"about": "This is about page"}


@app.get("/contact")
def read_contact():
    return {"contact": "This is contact page"}


# Albattrosdip
# steps--->
# 1. postgres drivers
# 2. servers
# 3. registration -> enterprise db -> first two options
# student_db > database > schemas > tables > right click > query tool