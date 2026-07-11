from fastapi import APIRouter,HTTPException,Depends,status
from schemas.job import JobCreate, JobUpdate,JobResponse
from models.job import Job
from models.job_application import JobApplication
from schemas.job_application import JobApplicationResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from database import get_db
from utils.oauth2 import role_required,get_current_user

router = APIRouter(prefix="/job", tags=["job"])

@router.post("/",status_code=status.HTTP_201_CREATED,response_model=JobResponse)
async def create_job(job: JobCreate,db:AsyncSession=Depends(get_db),current_user=Depends(role_required(["admin","super_admin"]))):
    try:
        db_job = Job(**job.dict(), owner_id=current_user.id)
        db.add(db_job)
        await db.commit()
        await db.refresh(db_job)
        return db_job
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error creating job: {str(e)}")

@router.get("/",status_code=status.HTTP_200_OK,response_model=list[JobResponse])
async def get_all_job(db:AsyncSession=Depends(get_db),current_user=Depends(get_current_user)):
    try:
        result = await db.execute(select(Job))
        jobs = result.scalars().all()
        return jobs
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error retrieving jobs: {str(e)}")

@router.get("/applications", status_code=status.HTTP_200_OK, response_model=list[JobApplicationResponse])
async def get_job_applications(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        if current_user.role == "super_admin":
            # Super Admin sees all applications
            result = await db.execute(
                select(JobApplication).options(selectinload(JobApplication.user), selectinload(JobApplication.job))
            )
        elif current_user.role == "admin":
            # Admin sees applications for jobs they created
            result = await db.execute(
                select(JobApplication).join(Job).filter(Job.owner_id == current_user.id).options(selectinload(JobApplication.user), selectinload(JobApplication.job))
            )
        else:
            # Candidates/others see only their own applications
            result = await db.execute(
                select(JobApplication).filter(JobApplication.user_id == current_user.id).options(selectinload(JobApplication.user), selectinload(JobApplication.job))
            )
        
        apps = result.scalars().all()
        
        # Map the username and email to the response
        response_apps = []
        for app in apps:
            response_apps.append({
                "id": app.id,
                "job_id": app.job_id,
                "user_id": app.user_id,
                "status": app.status,
                "applied_at": app.applied_at,
                "user_name": app.user.name if app.user else "Unknown",
                "user_email": app.user.email if app.user else "Unknown",
                "job_title": app.job.title if app.job else "Unknown Job"
            })
        return response_apps
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error retrieving job applications: {str(e)}")


@router.post("/{job_id}/apply", status_code=status.HTTP_201_CREATED, response_model=JobApplicationResponse)
async def apply_to_job(job_id: int, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        # Check if the job exists
        result_job = await db.execute(select(Job).filter(Job.id == job_id))
        job = result_job.scalars().first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        # Check if they are admin/super_admin (admins/super_admins shouldn't apply to jobs)
        if current_user.role in ["admin", "super_admin"]:
            raise HTTPException(status_code=400, detail="Administrators and Super Admins cannot apply to jobs.")

        # Check if already applied
        result_app = await db.execute(
            select(JobApplication).filter(
                JobApplication.job_id == job_id,
                JobApplication.user_id == current_user.id
            )
        )
        existing_app = result_app.scalars().first()
        if existing_app:
            raise HTTPException(status_code=400, detail="You have already applied to this job.")

        db_app = JobApplication(job_id=job_id, user_id=current_user.id)
        db.add(db_app)
        await db.commit()
        await db.refresh(db_app)
        return db_app
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error applying to job: {str(e)}")

@router.get("/{job_id}",status_code=status.HTTP_200_OK,response_model=JobResponse)
async def get_job(job_id: int,db:AsyncSession=Depends(get_db),current_user=Depends(get_current_user)):
    try:
        result = await db.execute(select(Job).filter(Job.id == job_id))
        job = result.scalars().first()
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
        return job
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error retrieving job: {str(e)}")

@router.put("/{job_id}",status_code=status.HTTP_201_CREATED,response_model=JobResponse)
async def update_job(job_id: int, job: JobUpdate,db:AsyncSession=Depends(get_db),current_user=Depends(role_required(["admin","super_admin"]))):
    try:
        result = await db.execute(select(Job).filter(Job.id == job_id))
        db_job = result.scalars().first()
        if not db_job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
        for key, value in job.dict().items():
            setattr(db_job, key, value)
        await db.commit()
        await db.refresh(db_job)
        return db_job
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error updating job: {str(e)}")

@router.delete("/{job_id}",status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(job_id: int,db:AsyncSession=Depends(get_db),current_user=Depends(role_required(["admin","super_admin"]))):
    try:
        result = await db.execute(select(Job).filter(Job.id == job_id))
        db_job = result.scalars().first()
        if not db_job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
        await db.delete(db_job)
        await db.commit()
        return {"message": "Job deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error deleting job: {str(e)}")

@router.post("/applications/{application_id}/approve", status_code=status.HTTP_200_OK)
async def approve_job_application(application_id: int, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        # Check role: must be admin or super_admin
        if current_user.role not in ["admin", "super_admin"]:
            raise HTTPException(status_code=403, detail="Access denied. Only admins or super admins can approve job applications.")

        # Get application with job loaded
        result = await db.execute(
            select(JobApplication).filter(JobApplication.id == application_id).options(selectinload(JobApplication.job))
        )
        application = result.scalars().first()
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")

        # Check if current_user is creator of the job, or super admin
        if current_user.role != "super_admin" and application.job.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied. You can only approve applications for jobs you created.")

        application.status = "Approved"
        db.add(application)
        await db.commit()
        await db.refresh(application)
        return {"message": "Application approved successfully", "status": application.status}
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error approving job application: {str(e)}")