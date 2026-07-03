from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from database import get_db
from models.company import Company
from models.job import Job
from schemas.job import JobCreate, JobResponse, JobUpdate
from utils.oauth2 import get_current_user, role_required

router = APIRouter(prefix="/job", tags=["job"])


def ensure_company_exists(company_id: int, db: Session):
    if not db.query(Company).filter(Company.id == company_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="company_id does not exist")


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=JobResponse)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user=Depends(role_required(["admin", "hr"])),
):
    ensure_company_exists(job.company_id, db)
    db_job = Job(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job


@router.get("/", status_code=status.HTTP_200_OK, response_model=list[JobResponse])
def get_all_job(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Job).all()


@router.get("/{job_id}", status_code=status.HTTP_200_OK, response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job


@router.put("/{job_id}", status_code=status.HTTP_200_OK, response_model=JobResponse)
def update_job(
    job_id: int,
    job: JobUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(role_required(["admin", "hr"])),
):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    updates = job.model_dump(exclude_unset=True)
    if "company_id" in updates and updates["company_id"] is not None:
        ensure_company_exists(updates["company_id"], db)
    for key, value in updates.items():
        setattr(db_job, key, value)
    db.commit()
    db.refresh(db_job)
    return db_job


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(role_required(["admin", "hr"])),
):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    db.delete(db_job)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
