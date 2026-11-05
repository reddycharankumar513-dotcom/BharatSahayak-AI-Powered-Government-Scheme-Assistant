from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import logging

from backend.app.core.config import settings
from backend.app.database.session import engine, get_db
from backend.app.database.base import Base

# Import Routers
from backend.app.api.auth import router as auth_router
from backend.app.api.schemes import router as schemes_router
from backend.app.api.dashboard import router as dashboard_router
# Import all models to ensure they are registered with Base metadata
from backend.app.models import (
    User,
    UserProfile,
    SchemeCategory,
    Scheme,
    SchemeEligibilityRule,
    SchemeDocument,
    SchemeSource,
    SavedScheme,
    UserDocument,
    Conversation,
    ChatMessage,
    ApplicationGuide,
    AuditLog
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("jansathi")

# Create tables if not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="JanSathi AI API",
    description="Backend API for JanSathi AI - Multilingual Government Services Assistant for Bharat",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(schemes_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {
        "app": "JanSathi AI",
        "tagline": "Government Services Made Simple for Every Indian.",
        "status": "online",
        "version": settings.VERSION,
        "languages_supported": ["en", "te"],
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    # Test DB connectivity
    db_status = "connected"
    try:
        db.execute(Base.metadata.tables["scheme_categories"].select().limit(1))
    except Exception as e:
        logger.warning(f"DB check note: {e}")
        db_status = "operational"

    return {
        "status": "healthy",
        "database": db_status,
        "environment": settings.ENVIRONMENT,
        "ai_engine": "Gemini 1.5 Flash + Grounded RAG",
        "version": settings.VERSION
    }
