from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.app.database.session import get_db
from backend.app.models.models import (
    Scheme,
    SavedScheme,
    User,
    ApplicationGuide,
    UserDocument
)
from backend.app.schemas.schemas import (
    DashboardSummaryOut,
    SchemeListOut,
    UserOut
)
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Citizen Dashboard"])

@router.get("/summary", response_model=DashboardSummaryOut)
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.profile
    occupation = profile.occupation.lower() if profile and profile.occupation else ""
    annual_income = profile.annual_income if profile and profile.annual_income else 200000

    # Total schemes count
    total_schemes = db.query(Scheme).filter(Scheme.is_active == True).count()

    # Saved schemes
    saved_records = db.query(SavedScheme).filter(SavedScheme.user_id == current_user.id).all()
    saved_schemes = []
    saved_ids = set()
    for s_rec in saved_records:
        if s_rec.scheme and s_rec.scheme.is_active:
            s_out = SchemeListOut.from_orm(s_rec.scheme)
            s_out.is_saved = True
            saved_schemes.append(s_out)
            saved_ids.add(s_rec.scheme.id)

    # Smart personalized recommendations based on profile
    recommended_query = db.query(Scheme).filter(Scheme.is_active == True)
    if "farm" in occupation or "agri" in occupation or "రైతు" in occupation:
        # Prioritize Agriculture & Healthcare schemes
        recommended_schemes_raw = (
            recommended_query.filter(Scheme.slug.in_(["pm-kisan", "ayushman-bharat", "pm-awas-yojana"]))
            .all()
        )
    elif "student" in occupation or "విద్యార్థి" in occupation:
        recommended_schemes_raw = (
            recommended_query.filter(Scheme.slug.in_(["pm-vidyalakshmi", "ayushman-bharat", "sukanya-samriddhi"]))
            .all()
        )
    elif "business" in occupation or "entrepreneur" in occupation or "వ్యాపార" in occupation:
        recommended_schemes_raw = (
            recommended_query.filter(Scheme.slug.in_(["pm-mudra-yojana", "ayushman-bharat", "pm-awas-yojana"]))
            .all()
        )
    else:
        # Default top initiatives
        recommended_schemes_raw = recommended_query.limit(4).all()

    recommended_schemes = []
    for s in recommended_schemes_raw:
        s_out = SchemeListOut.from_orm(s)
        s_out.is_saved = s.id in saved_ids
        recommended_schemes.append(s_out)

    # Document readiness estimate
    user_docs_count = db.query(UserDocument).filter(UserDocument.user_id == current_user.id).count()
    # If 3 or more standard docs uploaded (Aadhaar, Income, Land/Ration), readiness is high
    readiness_score = min(100, int((user_docs_count / 3.0) * 100)) if user_docs_count > 0 else 35

    # Active application guides
    active_guides_count = db.query(ApplicationGuide).filter(
        ApplicationGuide.user_id == current_user.id,
        ApplicationGuide.status == "In Progress"
    ).count()

    return {
        "user": current_user,
        "recommended_schemes": recommended_schemes,
        "saved_schemes": saved_schemes,
        "total_schemes_count": total_schemes,
        "saved_schemes_count": len(saved_schemes),
        "documents_readiness_score": readiness_score,
        "active_guides_count": active_guides_count
    }
