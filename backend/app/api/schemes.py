from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from typing import List, Optional

from backend.app.database.session import get_db
from backend.app.models.models import (
    Scheme,
    SchemeCategory,
    SavedScheme,
    User
)
from backend.app.schemas.schemas import (
    SchemeListOut,
    SchemeDetailOut,
    CategoryOut
)
from backend.app.api.deps import get_current_user, get_current_user_optional

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])

@router.get("/categories", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(SchemeCategory).order_by(SchemeCategory.name).all()
    return categories

@router.get("", response_model=List[SchemeListOut])
def list_schemes(
    search: Optional[str] = Query(None, description="Search keyword in scheme name or description"),
    category: Optional[str] = Query(None, description="Filter by category slug"),
    level: Optional[str] = Query(None, description="Central or State"),
    sort_by: Optional[str] = Query("popular", description="popular, recent, name_asc"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    query = db.query(Scheme).filter(Scheme.is_active == True)

    # Search filter (multilingual match)
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Scheme.name.ilike(search_fmt),
                Scheme.name_te.ilike(search_fmt),
                Scheme.summary.ilike(search_fmt),
                Scheme.summary_te.ilike(search_fmt),
                Scheme.benefits.ilike(search_fmt)
            )
        )

    # Category filter
    if category and category != "all":
        query = query.join(Scheme.category).filter(SchemeCategory.slug == category)

    # Level filter
    if level and level != "all":
        query = query.filter(Scheme.level == level)

    # Sorting
    if sort_by == "recent":
        query = query.order_by(desc(Scheme.last_verified_date))
    elif sort_by == "name_asc":
        query = query.order_by(asc(Scheme.name))
    else:
        query = query.order_by(desc(Scheme.id))

    schemes = query.offset(skip).limit(limit).all()

    # Get set of saved scheme IDs for current user
    saved_ids = set()
    if current_user:
        user_saved = db.query(SavedScheme.scheme_id).filter(SavedScheme.user_id == current_user.id).all()
        saved_ids = {s[0] for s in user_saved}

    # Attach is_saved flag
    results = []
    for s in schemes:
        item = SchemeListOut.from_orm(s)
        item.is_saved = s.id in saved_ids
        results.append(item)

    return results

@router.get("/saved", response_model=List[SchemeListOut])
def get_saved_schemes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved_entries = db.query(SavedScheme).filter(SavedScheme.user_id == current_user.id).all()
    results = []
    for entry in saved_entries:
        if entry.scheme and entry.scheme.is_active:
            item = SchemeListOut.from_orm(entry.scheme)
            item.is_saved = True
            results.append(item)
    return results

@router.post("/{scheme_id}/save")
def toggle_save_scheme(
    scheme_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    existing = db.query(SavedScheme).filter(
        SavedScheme.user_id == current_user.id,
        SavedScheme.scheme_id == scheme_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"saved": False, "message": "Scheme removed from saved list"}
    else:
        new_save = SavedScheme(user_id=current_user.id, scheme_id=scheme_id)
        db.add(new_save)
        db.commit()
        return {"saved": True, "message": "Scheme saved successfully"}

@router.get("/{identifier}", response_model=SchemeDetailOut)
def get_scheme_detail(
    identifier: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    # Lookup by ID or slug
    if identifier.isdigit():
        scheme = db.query(Scheme).filter(Scheme.id == int(identifier)).first()
    else:
        scheme = db.query(Scheme).filter(Scheme.slug == identifier).first()

    if not scheme or not scheme.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme '{identifier}' not found in official registry."
        )

    # Check is_saved
    is_saved = False
    if current_user:
        saved_record = db.query(SavedScheme).filter(
            SavedScheme.user_id == current_user.id,
            SavedScheme.scheme_id == scheme.id
        ).first()
        is_saved = saved_record is not None

    detail = SchemeDetailOut.from_orm(scheme)
    detail.is_saved = is_saved
    return detail
