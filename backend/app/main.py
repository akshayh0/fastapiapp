from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from models import job as job_model
from models import company as company_model
from models import users as user_model
from models import job_application as job_app_model
from routers import auth, company, job,rag,chat
from sqlalchemy import text

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    from database import engine, SessionLocal
    from models.users import User
    from utils.security import hash_password
    from sqlalchemy.future import select

    # Apply database schema updates and create tables
    async with engine.begin() as conn:
        await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;"))
        await conn.execute(text("ALTER TABLE companies ADD COLUMN IF NOT EXISTS owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL;"))
        await conn.execute(text("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL;"))
        await conn.run_sync(Base.metadata.create_all)


    # Seed the super admin carrier
    async with SessionLocal() as db:
        try:
            result = await db.execute(select(User).filter(User.email == "carrieradmin@gmail.com"))
            super_admin = result.scalars().first()
            if not super_admin:
                hashed = hash_password("carrier123")
                super_admin = User(
                    name="carrier",
                    email="carrieradmin@gmail.com",
                    hashed_password=hashed,
                    role="super_admin",
                    is_approved=True
                )
                db.add(super_admin)
                await db.commit()
                print("Super admin carrier seeded successfully.")
        except Exception as e:
            await db.rollback()
            print(f"Error seeding super admin: {str(e)}")


# Include Routers
app.include_router(auth.router)
app.include_router(company.router)
app.include_router(job.router)
app.include_router(chat.router)
app.include_router(rag.router)
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