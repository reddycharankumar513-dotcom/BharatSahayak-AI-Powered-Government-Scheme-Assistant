import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from backend.app.database.session import get_db
from backend.app.models.models import (
    Scheme,
    SchemeCategory,
    SchemeSource,
    User,
    UserDocument,
    AuditLog
)
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

class SourceVerifyRequest(BaseModel):
    scheme_id: int
    source_name: Optional[str] = None
    notes: Optional[str] = "Routine Gazette verification confirmed."

class SchemeCreateAdmin(BaseModel):
    name: str
    name_te: Optional[str] = None
    slug: str
    category_id: int
    level: str = "Central"
    summary: str
    summary_te: Optional[str] = None
    description: str
    description_te: Optional[str] = None
    benefits: str
    benefits_te: Optional[str] = None
    application_procedure: str
    application_procedure_te: Optional[str] = None
    official_website: str

@router.get("/analytics")
def get_admin_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_citizens = db.query(User).filter(User.role == "citizen").count()
    total_schemes = db.query(Scheme).filter(Scheme.is_active == True).count()
    total_categories = db.query(SchemeCategory).count()
    total_docs_processed = db.query(UserDocument).count()
    
    # Calculate Freshness (Verified within last 30 days)
    thirty_days_ago = datetime.datetime.utcnow() - datetime.timedelta(days=30)
    fresh_schemes_count = db.query(Scheme).filter(Scheme.last_verified_date >= thirty_days_ago).count()
    stale_schemes_count = max(0, total_schemes - fresh_schemes_count)

    recent_logs = (
        db.query(AuditLog)
        .order_by(AuditLog.timestamp.desc())
        .limit(10)
        .all()
    )

    return {
        "total_citizens": total_citizens,
        "total_schemes": total_schemes,
        "total_categories": total_categories,
        "total_documents_processed": total_docs_processed,
        "source_freshness": {
            "fresh_count": fresh_schemes_count,
            "due_for_review_count": stale_schemes_count,
            "freshness_ratio": f"{int((fresh_schemes_count / total_schemes) * 100) if total_schemes > 0 else 100}%"
        },
        "recent_audit_logs": [
            {
                "id": log.id,
                "action": log.action,
                "target_entity": log.target_entity,
                "target_id": log.target_id,
                "details": log.details or {},
                "timestamp": log.timestamp.isoformat()
            }
            for log in recent_logs
        ]
    }

@router.get("/schemes")
def get_admin_schemes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    schemes = db.query(Scheme).all()
    results = []
    thirty_days_ago = datetime.datetime.utcnow() - datetime.timedelta(days=30)

    for s in schemes:
        is_fresh = s.last_verified_date >= thirty_days_ago
        results.append({
            "id": s.id,
            "name": s.name,
            "name_te": s.name_te,
            "slug": s.slug,
            "level": s.level,
            "category": s.category.name if s.category else "General",
            "last_verified_date": s.last_verified_date.isoformat(),
            "is_fresh": is_fresh,
            "official_website": s.official_website,
            "rules_count": len(s.eligibility_rules),
            "documents_count": len(s.required_documents),
            "sources_count": len(s.sources),
            "is_active": s.is_active
        })
    return results

@router.post("/sources/verify")
def verify_scheme_source(
    payload: SourceVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    scheme = db.query(Scheme).filter(Scheme.id == payload.scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    now = datetime.datetime.utcnow()
    scheme.last_verified_date = now

    # Update or add source
    source = db.query(SchemeSource).filter(SchemeSource.scheme_id == scheme.id).first()
    if source:
        source.last_verified = now
        source.verification_status = "Verified"
        source.notes = payload.notes

    # Add audit log
    audit = AuditLog(
        user_id=current_user.id,
        action="source_verify",
        target_entity="Scheme",
        target_id=scheme.id,
        details={
            "scheme_name": scheme.name,
            "verified_by": current_user.email,
            "notes": payload.notes,
            "new_verification_date": now.isoformat()
        }
    )
    db.add(audit)
    db.commit()

    return {
        "status": "success",
        "message": f"Official source verification updated for '{scheme.name}'.",
        "last_verified_date": now.isoformat()
    }

@router.post("/schemes")
def create_scheme(
    payload: SchemeCreateAdmin,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(Scheme).filter(Scheme.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="A scheme with this slug already exists.")

    new_scheme = Scheme(
        name=payload.name,
        name_te=payload.name_te,
        slug=payload.slug,
        category_id=payload.category_id,
        level=payload.level,
        summary=payload.summary,
        summary_te=payload.summary_te,
        description=payload.description,
        description_te=payload.description_te,
        benefits=payload.benefits,
        benefits_te=payload.benefits_te,
        application_procedure=payload.application_procedure,
        application_procedure_te=payload.application_procedure_te,
        official_website=payload.official_website,
        last_verified_date=datetime.datetime.utcnow()
    )
    db.add(new_scheme)
    db.flush()

    audit = AuditLog(
        user_id=current_user.id,
        action="scheme_create",
        target_entity="Scheme",
        target_id=new_scheme.id,
        details={"name": new_scheme.name, "slug": new_scheme.slug, "created_by": current_user.email}
    )
    db.add(audit)
    db.commit()
    db.refresh(new_scheme)

    return {"message": "Scheme published successfully", "id": new_scheme.id, "slug": new_scheme.slug}
