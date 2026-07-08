from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv

load_dotenv()
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:password@localhost:5432/student_db"
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)


if "supabase.com" in SQLALCHEMY_DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.split("?")[0]
    engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=False, connect_args={"ssl": "require"})

else:
    engine = create_async_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = async_sessionmaker(autocommit=False,autoflush=False,bind=engine,class_=AsyncSession)
Base = declarative_base()

async def get_db():
    async with SessionLocal() as db:
        try:
            yield db
        finally:
            await db.close()
        