from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth & User Schemas ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None
    preferred_language: str = "en"  # "en" or "te"
    # Optional profile fields during registration
    age: Optional[int] = None
    gender: Optional[str] = None
    state: Optional[str] = "Andhra Pradesh"
    district: Optional[str] = None
    occupation: Optional[str] = "Farmer"
    annual_income: Optional[float] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class UserProfileOut(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    occupation: Optional[str] = None
    annual_income: Optional[float] = None
    caste_category: Optional[str] = None
    is_differently_abled: Optional[bool] = False
    land_holding_acres: Optional[float] = 0.0
    family_members_count: Optional[int] = 1

    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    occupation: Optional[str] = None
    annual_income: Optional[float] = None
    caste_category: Optional[str] = None
    is_differently_abled: Optional[bool] = None
    land_holding_acres: Optional[float] = None
    family_members_count: Optional[int] = None
    preferred_language: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    preferred_language: str
    role: str
    created_at: datetime
    profile: Optional[UserProfileOut] = None

    class Config:
        from_attributes = True

Token.model_rebuild()


# --- Scheme Schemas ---
class CategoryOut(BaseModel):
    id: int
    name: str
    name_te: Optional[str] = None
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = "Layers"

    class Config:
        from_attributes = True

class SchemeRuleOut(BaseModel):
    id: int
    rule_type: str
    rule_operator: str
    rule_value: str
    description: str
    description_te: Optional[str] = None
    is_mandatory: bool

    class Config:
        from_attributes = True

class SchemeDocumentOut(BaseModel):
    id: int
    document_type: str
    document_type_te: Optional[str] = None
    description: Optional[str] = None
    is_mandatory: bool

    class Config:
        from_attributes = True

class SchemeSourceOut(BaseModel):
    id: int
    source_name: str
    url: str
    last_verified: datetime
    verification_status: str

    class Config:
        from_attributes = True

class SchemeListOut(BaseModel):
    id: int
    name: str
    name_te: Optional[str] = None
    slug: str
    level: str
    state: Optional[str] = None
    summary: str
    summary_te: Optional[str] = None
    benefits: str
    benefits_te: Optional[str] = None
    official_website: str
    last_verified_date: datetime
    category: Optional[CategoryOut] = None
    is_saved: Optional[bool] = False

    class Config:
        from_attributes = True

class SchemeDetailOut(SchemeListOut):
    description: str
    description_te: Optional[str] = None
    application_procedure: str
    application_procedure_te: Optional[str] = None
    eligibility_rules: List[SchemeRuleOut] = []
    required_documents: List[SchemeDocumentOut] = []
    sources: List[SchemeSourceOut] = []

    class Config:
        from_attributes = True

# --- Dashboard Schemas ---
class DashboardSummaryOut(BaseModel):
    user: UserOut
    recommended_schemes: List[SchemeListOut] = []
    saved_schemes: List[SchemeListOut] = []
    total_schemes_count: int
    saved_schemes_count: int
    documents_readiness_score: int  # percentage 0-100
    active_guides_count: int
