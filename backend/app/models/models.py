import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from backend.app.database.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    preferred_language = Column(String(10), default="en")  # "en" or "te"
    role = Column(String(50), default="citizen")  # "citizen", "admin"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    saved_schemes = relationship("SavedScheme", back_populates="user", cascade="all, delete-orphan")
    user_documents = relationship("UserDocument", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    application_guides = relationship("ApplicationGuide", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    state = Column(String(100), default="Andhra Pradesh")  # or "Telangana", etc.
    district = Column(String(100), nullable=True)
    occupation = Column(String(100), nullable=True)  # Farmer, Student, Small Business, etc.
    annual_income = Column(Float, nullable=True)
    caste_category = Column(String(50), nullable=True)  # General, OBC, SC, ST, EWS
    is_differently_abled = Column(Boolean, default=False)
    land_holding_acres = Column(Float, default=0.0)
    family_members_count = Column(Integer, default=1)
    extra_details = Column(JSON, default=dict)

    user = relationship("User", back_populates="profile")


class SchemeCategory(Base):
    __tablename__ = "scheme_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    name_te = Column(String(100), nullable=True)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), default="Layers")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    schemes = relationship("Scheme", back_populates="category")


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    name_te = Column(String(255), nullable=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("scheme_categories.id"), nullable=True)
    level = Column(String(50), default="Central")  # "Central" or "State"
    state = Column(String(100), nullable=True)  # For state-specific schemes
    summary = Column(Text, nullable=False)
    summary_te = Column(Text, nullable=True)
    description = Column(Text, nullable=False)
    description_te = Column(Text, nullable=True)
    benefits = Column(Text, nullable=False)
    benefits_te = Column(Text, nullable=True)
    application_procedure = Column(Text, nullable=False)
    application_procedure_te = Column(Text, nullable=True)
    official_website = Column(String(500), nullable=False)
    last_verified_date = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    category = relationship("SchemeCategory", back_populates="schemes")
    eligibility_rules = relationship("SchemeEligibilityRule", back_populates="scheme", cascade="all, delete-orphan")
    required_documents = relationship("SchemeDocument", back_populates="scheme", cascade="all, delete-orphan")
    sources = relationship("SchemeSource", back_populates="scheme", cascade="all, delete-orphan")
    saved_by = relationship("SavedScheme", back_populates="scheme", cascade="all, delete-orphan")
    application_guides = relationship("ApplicationGuide", back_populates="scheme", cascade="all, delete-orphan")


class SchemeEligibilityRule(Base):
    __tablename__ = "scheme_eligibility_rules"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    rule_type = Column(String(50), nullable=False)  # "age", "income", "occupation", "land_holding", "state", "gender"
    rule_operator = Column(String(20), nullable=False)  # "lt", "lte", "gt", "gte", "eq", "in"
    rule_value = Column(String(255), nullable=False)
    description = Column(String(500), nullable=False)
    description_te = Column(String(500), nullable=True)
    is_mandatory = Column(Boolean, default=True)

    scheme = relationship("Scheme", back_populates="eligibility_rules")


class SchemeDocument(Base):
    __tablename__ = "scheme_documents"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    document_type = Column(String(100), nullable=False)  # "Aadhaar Card", "Income Certificate", etc.
    document_type_te = Column(String(100), nullable=True)
    description = Column(String(500), nullable=True)
    is_mandatory = Column(Boolean, default=True)

    scheme = relationship("Scheme", back_populates="required_documents")


class SchemeSource(Base):
    __tablename__ = "scheme_sources"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    source_name = Column(String(255), nullable=False)  # "Official Ministry Gazette", "data.gov.in"
    url = Column(String(500), nullable=False)
    last_verified = Column(DateTime, default=datetime.datetime.utcnow)
    verification_status = Column(String(50), default="Verified")  # "Verified", "Needs Verification", "Updated"
    notes = Column(Text, nullable=True)

    scheme = relationship("Scheme", back_populates="sources")


class SavedScheme(Base):
    __tablename__ = "saved_schemes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    saved_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="saved_schemes")
    scheme = relationship("Scheme", back_populates="saved_by")


class UserDocument(Base):
    __tablename__ = "user_documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    document_type = Column(String(100), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, default=0)
    mime_type = Column(String(100), nullable=False)
    extracted_text = Column(Text, nullable=True)
    extracted_fields = Column(JSON, default=dict)
    ocr_status = Column(String(50), default="Pending")  # "Pending", "Processed", "Failed"
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="user_documents")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    session_id = Column(String(100), index=True, nullable=False)
    title = Column(String(255), default="Government Service Inquiry")
    language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="conversations")
    messages = relationship("ChatMessage", back_populates="conversation", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(50), nullable=False)  # "user", "assistant", "system"
    content = Column(Text, nullable=False)
    sources = Column(JSON, default=list)  # Grounded official sources used
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")


class ApplicationGuide(Base):
    __tablename__ = "application_guides"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    current_step = Column(Integer, default=1)
    total_steps = Column(Integer, default=5)
    checklist_status = Column(JSON, default=dict)  # {"step_1": True, "step_2": False}
    status = Column(String(50), default="In Progress")  # "In Progress", "Completed"
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="application_guides")
    scheme = relationship("Scheme", back_populates="application_guides")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False)  # "scheme_create", "scheme_update", "source_verify"
    target_entity = Column(String(100), nullable=False)
    target_id = Column(Integer, nullable=True)
    details = Column(JSON, default=dict)
    ip_address = Column(String(45), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")
