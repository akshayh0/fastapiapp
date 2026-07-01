from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.job import JobCreate, JobUpdate, JobResponse
from models.job import Job
from models.company import Company
from database import get_db

router = APIRouter(prefix="/job", tags=["job"])

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=JobResponse)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == job.company_id).first()
    if not company:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="company_id does not exist")
    db_job = Job(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/", status_code=status.HTTP_200_OK, response_model=list[JobResponse])
def get_all_job(db: Session = Depends(get_db)):
    return db.query(Job).all()

@router.get("/{job_id}", status_code=status.HTTP_200_OK, response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return db_job

@router.put("/{job_id}", status_code=status.HTTP_202_ACCEPTED, response_model=JobResponse)
def update_job(job_id: int, job: JobUpdate, db: Session = Depends(get_db)):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    for key, value in job.model_dump(exclude_none=True).items():
        setattr(db_job, key, value)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: int, db: Session = Depends(get_db)):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    db.delete(db_job)
    db.commit()
    return None