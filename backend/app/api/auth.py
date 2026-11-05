from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from backend.app.database.session import get_db
from backend.app.models.models import User, UserProfile
from backend.app.schemas.schemas import (
    UserRegister,
    UserLogin,
    Token,
    UserOut,
    UserProfileUpdate
)
from backend.app.core.security import hash_password, verify_password, create_access_token
from backend.app.core.config import settings
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    # Check if email already registered
    existing_user = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A citizen account with this email address already exists."
        )

    # Create User
    new_user = User(
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name or payload.email.split("@")[0].title(),
        preferred_language=payload.preferred_language,
        role="citizen"
    )
    db.add(new_user)
    db.flush()

    # Create associated profile
    new_profile = UserProfile(
        user_id=new_user.id,
        age=payload.age,
        gender=payload.gender,
        state=payload.state or "Andhra Pradesh",
        district=payload.district,
        occupation=payload.occupation or "Farmer",
        annual_income=payload.annual_income
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_user)

    # Issue JWT token
    access_token = create_access_token(
        data={"sub": str(new_user.id), "email": new_user.email, "role": new_user.role}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=Token)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password combination."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Please contact portal administrator."
        )

    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserOut)
def update_profile(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.preferred_language:
        current_user.preferred_language = payload.preferred_language

    profile = current_user.profile
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        db.flush()

    # Update profile fields if provided
    for field in [
        "age", "gender", "state", "district", "occupation", 
        "annual_income", "caste_category", "is_differently_abled",
        "land_holding_acres", "family_members_count"
    ]:
        val = getattr(payload, field, None)
        if val is not None:
            setattr(profile, field, val)

    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/forgot-password")
def forgot_password(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email.lower()).first()
    # Always return a clean message so email existence is not leaked
    return {
        "message": "If this email is registered, password reset instructions have been sent.",
        "support_note": "For hackathon demonstration, you can use the preset demo accounts: citizen@jansathi.gov.in (JanSathiDemo2026!) or admin@jansathi.gov.in (AdminJanSathi2026!)."
    }
