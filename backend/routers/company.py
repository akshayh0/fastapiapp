from fastapi import APIRouter,HTTPException,Depends,status
from loguru import logger
import os
import time
from schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse
from models.company import Company
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from database import get_db
from utils.oauth2 import role_required,get_current_user
router = APIRouter(prefix="/company",tags=["company"])

@router.post("/",status_code=status.HTTP_201_CREATED,response_model=CompanyResponse)
async def create_company(company: CompanyCreate,db:AsyncSession=Depends(get_db),current_user=Depends(role_required(["admin", "super_admin"]))):
    try:
        db_company=Company(**company.dict(), owner_id=current_user.id)
        db.add(db_company)
        await db.commit()
        await db.refresh(db_company)
        # Ensure related 'jobs' are loaded to avoid async lazy-loading during response serialization
        result = await db.execute(select(Company).filter(Company.id == db_company.id).options(selectinload(Company.jobs)))
        company_with_jobs = result.scalars().first()
        return company_with_jobs
    except Exception as e:
        await db.rollback()
        logger.exception("Error creating company: {}", e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error creating company: {str(e)}")


@router.get("/",status_code=status.HTTP_200_OK,response_model=list[CompanyResponse])
async def get_all_company(db:AsyncSession=Depends(get_db),current_user=Depends(get_current_user)):
    try:
        result = await db.execute(select(Company).options(selectinload(Company.jobs)))
        companies = result.scalars().all()
        return companies
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error retrieving companies: {str(e)}")

@router.get("/{company_id}",status_code=status.HTTP_200_OK,response_model=CompanyResponse)
async def get_company(company_id: int,db:AsyncSession=Depends(get_db),current_user=Depends(get_current_user)):
    try:
        result = await db.execute(select(Company).filter(Company.id == company_id).options(selectinload(Company.jobs)))
        company = result.scalars().first()
        if not company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        return company
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error retrieving company: {str(e)}")

@router.put("/{company_id}",status_code=status.HTTP_201_CREATED)
async def update_company(company_id: int, company: CompanyUpdate,db:AsyncSession=Depends(get_db),current_user=Depends(role_required(["admin", "super_admin"]))):
    try:
        result = await db.execute(select(Company).filter(Company.id == company_id))
        db_company = result.scalars().first()
        if not db_company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        for key, value in company.dict().items():
            setattr(db_company, key, value)
        await db.commit()
        await db.refresh(db_company)
        return db_company
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error updating company: {str(e)}")

@router.delete("/{company_id}",status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(company_id: int,db:AsyncSession=Depends(get_db),current_user=Depends(role_required(["admin", "super_admin"]))):
    try:
        result = await db.execute(select(Company).filter(Company.id == company_id))
        db_company = result.scalars().first()
        if not db_company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        await db.delete(db_company)
        await db.commit()
        return {"message": "Company deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error deleting company: {str(e)}")


# Debug-only endpoint: create a test company without auth when DEBUG=true
if os.getenv("DEBUG", "false").lower() == "true":
    @router.post("/debug-create-test-company", status_code=status.HTTP_201_CREATED)
    async def debug_create_test_company(db: AsyncSession = Depends(get_db)):
        try:
            # use timestamped values to avoid unique constraint collisions
            ts = int(time.time())
            db_company = Company(name=f"DebugCo-{ts}", email=f"debug{ts}@example.com", phone=str(ts)[-10:], location="Debug")
            db.add(db_company)
            await db.commit()
            await db.refresh(db_company)
            return {"ok": True, "id": db_company.id}
        except Exception as e:
            await db.rollback()
            logger.exception("Debug create failed: {}", e)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Debug create failed: {str(e)}")

# @router.get("/")
# def read_company():
#     return {"company": "Company root"}

# @router.get("/{company_id}")
# def read_company(company_id: int):
#     return {"company_id": company_id}