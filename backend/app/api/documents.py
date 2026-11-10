import os
import shutil
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from backend.app.database.session import get_db
from backend.app.models.models import UserDocument, Scheme, SchemeDocument, User
from backend.app.api.deps import get_current_user, get_current_user_optional
from backend.app.ocr.ocr_engine import ocr_engine

router = APIRouter(prefix="/documents", tags=["Document Intelligence Centre"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

class UserDocumentOut(BaseModel):
    id: int
    document_type: str
    file_name: str
    file_size_bytes: int
    mime_type: str
    extracted_text: Optional[str] = None
    extracted_fields: Dict[str, Any] = {}
    ocr_status: str
    uploaded_at: str

    class Config:
        from_attributes = True

class ReadinessCheckRequest(BaseModel):
    scheme_slug: str

class ReadinessItem(BaseModel):
    document_name: str
    document_name_te: Optional[str] = None
    is_mandatory: bool
    is_uploaded: bool
    matched_file_name: Optional[str] = None

class ReadinessReport(BaseModel):
    scheme_name: str
    readiness_percentage: int
    status: str  # "Fully Ready", "Partially Ready", "Missing Mandatory Documents"
    checklist: List[ReadinessItem]
    missing_categories: List[str]
    disclaimer: str

@router.post("/upload", response_model=UserDocumentOut)
async def upload_document(
    file: UploadFile = File(...),
    document_type: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed formats: PDF, JPG, JPEG, PNG."
        )

    # Generate safe unique filename
    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(file_path)
    if file_size > MAX_FILE_SIZE_BYTES:
        os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum allowable limit of 10 MB."
        )

    # Process OCR & Field extraction
    extracted_text = ocr_engine.extract_text_from_file(file_path, file.content_type)
    detected_type, fields = ocr_engine.detect_document_type_and_fields(file.filename, extracted_text)

    final_type = document_type or detected_type

    doc_record = UserDocument(
        user_id=current_user.id,
        document_type=final_type,
        file_name=file.filename,
        file_path=file_path,
        file_size_bytes=file_size,
        mime_type=file.content_type or "application/octet-stream",
        extracted_text=extracted_text,
        extracted_fields=fields,
        ocr_status="Processed"
    )
    db.add(doc_record)
    db.commit()
    db.refresh(doc_record)

    return {
        "id": doc_record.id,
        "document_type": doc_record.document_type,
        "file_name": doc_record.file_name,
        "file_size_bytes": doc_record.file_size_bytes,
        "mime_type": doc_record.mime_type,
        "extracted_text": doc_record.extracted_text,
        "extracted_fields": doc_record.extracted_fields or {},
        "ocr_status": doc_record.ocr_status,
        "uploaded_at": doc_record.uploaded_at.isoformat()
    }

@router.get("", response_model=List[UserDocumentOut])
def list_user_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    docs = db.query(UserDocument).filter(UserDocument.user_id == current_user.id).order_by(UserDocument.uploaded_at.desc()).all()
    return [
        {
            "id": d.id,
            "document_type": d.document_type,
            "file_name": d.file_name,
            "file_size_bytes": d.file_size_bytes,
            "mime_type": d.mime_type,
            "extracted_text": d.extracted_text,
            "extracted_fields": d.extracted_fields or {},
            "ocr_status": d.ocr_status,
            "uploaded_at": d.uploaded_at.isoformat()
        }
        for d in docs
    ]

@router.delete("/{doc_id}")
def delete_user_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(UserDocument).filter(UserDocument.id == doc_id, UserDocument.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception:
            pass

    db.delete(doc)
    db.commit()
    return {"message": "Document permanently deleted from secure storage"}

@router.post("/readiness-check", response_model=ReadinessReport)
def check_document_readiness(
    payload: ReadinessCheckRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    scheme = db.query(Scheme).filter(Scheme.slug == payload.scheme_slug).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    user_docs = db.query(UserDocument).filter(UserDocument.user_id == current_user.id).all()
    user_doc_types = [d.document_type.lower() for d in user_docs]

    checklist = []
    missing = []
    uploaded_count = 0

    for req in scheme.required_documents:
        req_name = req.document_type
        # Fuzzy match with user uploaded types
        matched = False
        matched_file = None

        for d in user_docs:
            d_type = d.document_type.lower()
            r_type = req_name.lower()
            if any(k in d_type for k in r_type.split()) or any(k in r_type for k in d_type.split()):
                matched = True
                matched_file = d.file_name
                break

        if matched:
            uploaded_count += 1
        elif req.is_mandatory:
            missing.append(req_name)

        checklist.append(ReadinessItem(
            document_name=req.document_type,
            document_name_te=req.document_type_te,
            is_mandatory=req.is_mandatory,
            is_uploaded=matched,
            matched_file_name=matched_file
        ))

    total_req = len(scheme.required_documents)
    pct = int((uploaded_count / total_req) * 100) if total_req > 0 else 100

    if pct == 100:
        status_text = "Fully Ready"
    elif not missing:
        status_text = "Partially Ready (Mandatory Documents Complete)"
    else:
        status_text = "Missing Mandatory Documents"

    return ReadinessReport(
        scheme_name=scheme.name,
        readiness_percentage=pct,
        status=status_text,
        checklist=checklist,
        missing_categories=missing,
        disclaimer="Smart Document Readiness matches file metadata against official scheme rules. Note that OCR parsing is informational and does not replace official government verification."
    )
