from fastapi import APIRouter,Depends,HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.users import User
from schemas.users import UserCreate,UserResponse,ForgotPasswordRequest,ResetPasswordRequest,ChangePasswordRequest,ResetPasswordDirectRequest
from schemas.token import Token
from database import get_db
from utils.security import hash_password,verify_password
from utils.token import create_access_token,verify_access_token
from utils.oauth2 import get_current_user, role_required
from datetime import timedelta

router = APIRouter(prefix="/auth",tags=["Auth"])

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/pending-users", response_model=list[UserResponse])
async def get_pending_users(db: AsyncSession = Depends(get_db), current_user: User = Depends(role_required(["super_admin"]))):
    try:
        result = await db.execute(select(User).filter(User.is_approved == False))
        pending = result.scalars().all()
        return pending
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error retrieving pending users: {str(e)}")

@router.post("/approve-user/{user_id}", response_model=UserResponse)
async def approve_user(user_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(role_required(["super_admin"]))):
    try:
        result = await db.execute(select(User).filter(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user.is_approved = True
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error approving user: {str(e)}")

@router.post("/register",response_model=UserResponse)
async def register(user:UserCreate,db:AsyncSession = Depends(get_db)):
    try:
        if not user.email.lower().endswith("@gmail.com"):
            raise HTTPException(status_code=400, detail="Only @gmail.com email addresses are allowed")
        result = await db.execute(select(User).filter(User.email == user.email))
        existing_user = result.scalars().first()
        if existing_user:
            raise HTTPException(status_code=400,detail="Email already exists")
        hashed_password=hash_password(user.password)
        db_user=User(
            name=user.name,
            email=user.email,
            hashed_password=hashed_password,
            role=user.role,
            is_approved=(user.email.lower() == "carrieradmin@gmail.com")
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error during registration: {str(e)}")

@router.post("/login",response_model=Token)
async def login(form_data:OAuth2PasswordRequestForm=Depends(),db:AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(User).filter(User.email == form_data.username))
        existing_user = result.scalars().first()
        if not existing_user:
            raise HTTPException(status_code=404,detail="User not found")
        if not verify_password(form_data.password,existing_user.hashed_password):
            raise HTTPException(status_code=401,detail="Incorrect password")
        if not existing_user.is_approved:
            raise HTTPException(status_code=403, detail="Your registration is pending approval by the super admin (carrier).")
        access_token=create_access_token(data={"sub":str(existing_user.id),"role":existing_user.role})
        return {"access_token":access_token,"token_type":"Bearer"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication server error: {str(e)}")


@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    try:
        if not request.email.lower().endswith("@gmail.com"):
            raise HTTPException(status_code=400, detail="Only @gmail.com email addresses are allowed")
        result = await db.execute(select(User).filter(User.email == request.email))
        existing_user = result.scalars().first()
        if not existing_user:
            return {"message": "Password reset link generated if the email is registered."}
        
        reset_token = create_access_token(
            data={"sub": existing_user.email, "type": "reset"},
            expires_delta=timedelta(minutes=15)
        )
        
        reset_link = f"http://localhost:5173/?reset_token={reset_token}"
        print("\n" + "="*80)
        print(f"PASSWORD RESET REQUEST FOR: {existing_user.email}")
        print(f"RESET LINK: {reset_link}")
        print("="*80 + "\n")
        
        return {
            "message": "Password reset link generated if the email is registered.",
            "reset_token": reset_token,
            "reset_link": reset_link
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating reset link: {str(e)}")

@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    try:
        payload = verify_access_token(request.token)
        if payload.get("type") != "reset":
            raise HTTPException(status_code=400, detail="Invalid token type")
        
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=400, detail="Invalid token payload")
        
        result = await db.execute(select(User).filter(User.email == email))
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.hashed_password = hash_password(request.new_password)
        db.add(user)
        await db.commit()
        return {"message": "Password reset successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

@router.post("/change-password")
async def change_password(request: ChangePasswordRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        if not verify_password(request.old_password, current_user.hashed_password):
            raise HTTPException(status_code=400, detail="Incorrect old password")
        current_user.hashed_password = hash_password(request.new_password)
        db.add(current_user)
        await db.commit()
        return {"message": "Password changed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error changing password: {str(e)}")

@router.post("/reset-password-direct")
async def reset_password_direct(request: ResetPasswordDirectRequest, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(User).filter(User.email == request.email))
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Compare names case-insensitively
        if user.name.strip().lower() != request.name.strip().lower():
            raise HTTPException(status_code=400, detail="Username and Gmail do not match")
            
        user.hashed_password = hash_password(request.new_password)
        db.add(user)
        await db.commit()
        return {"message": "Password reset successfully. You can now login with your new password."}
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error resetting password: {str(e)}")


