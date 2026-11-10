from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from backend.app.database.session import get_db
from backend.app.models.models import ApplicationGuide, Scheme, User
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/guides", tags=["Application Guide Assistant"])

class GuideStepUpdate(BaseModel):
    current_step: int
    checklist_status: Dict[str, bool] = {}
    is_completed: Optional[bool] = False

class GuideOut(BaseModel):
    id: int
    scheme_id: int
    scheme_name: str
    scheme_slug: str
    current_step: int
    total_steps: int
    checklist_status: Dict[str, Any]
    status: str
    official_website: str

@router.get("/{scheme_identifier}", response_model=GuideOut)
def get_or_create_guide(
    scheme_identifier: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if scheme_identifier.isdigit():
        scheme = db.query(Scheme).filter(Scheme.id == int(scheme_identifier)).first()
    else:
        scheme = db.query(Scheme).filter(Scheme.slug == scheme_identifier).first()

    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    guide = db.query(ApplicationGuide).filter(
        ApplicationGuide.user_id == current_user.id,
        ApplicationGuide.scheme_id == scheme.id
    ).first()

    if not guide:
        # Initialize default guide
        guide = ApplicationGuide(
            user_id=current_user.id,
            scheme_id=scheme.id,
            current_step=1,
            total_steps=5,
            checklist_status={
                "step_1_overview_read": True,
                "step_2_eligibility_checked": False,
                "step_3_documents_uploaded": False,
                "step_4_form_previewed": False,
                "step_5_official_portal_visited": False
            },
            status="In Progress"
        )
        db.add(guide)
        db.commit()
        db.refresh(guide)

    return {
        "id": guide.id,
        "scheme_id": scheme.id,
        "scheme_name": scheme.name,
        "scheme_slug": scheme.slug,
        "current_step": guide.current_step,
        "total_steps": guide.total_steps,
        "checklist_status": guide.checklist_status or {},
        "status": guide.status,
        "official_website": scheme.official_website
    }

@router.post("/{scheme_identifier}/step", response_model=GuideOut)
def update_guide_step(
    scheme_identifier: str,
    payload: GuideStepUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if scheme_identifier.isdigit():
        scheme = db.query(Scheme).filter(Scheme.id == int(scheme_identifier)).first()
    else:
        scheme = db.query(Scheme).filter(Scheme.slug == scheme_identifier).first()

    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    guide = db.query(ApplicationGuide).filter(
        ApplicationGuide.user_id == current_user.id,
        ApplicationGuide.scheme_id == scheme.id
    ).first()

    if not guide:
        guide = ApplicationGuide(
            user_id=current_user.id,
            scheme_id=scheme.id,
            current_step=payload.current_step,
            checklist_status=payload.checklist_status
        )
        db.add(guide)
    else:
        guide.current_step = payload.current_step
        if payload.checklist_status:
            updated_status = dict(guide.checklist_status or {})
            updated_status.update(payload.checklist_status)
            guide.checklist_status = updated_status

        if payload.is_completed or payload.current_step >= guide.total_steps:
            guide.status = "Completed"

    db.commit()
    db.refresh(guide)

    return {
        "id": guide.id,
        "scheme_id": scheme.id,
        "scheme_name": scheme.name,
        "scheme_slug": scheme.slug,
        "current_step": guide.current_step,
        "total_steps": guide.total_steps,
        "checklist_status": guide.checklist_status or {},
        "status": guide.status,
        "official_website": scheme.official_website
    }
