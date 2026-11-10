import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from backend.app.database.session import get_db
from backend.app.models.models import Conversation, ChatMessage, User
from backend.app.api.deps import get_current_user_optional
from backend.app.rag.rag_engine import rag_engine

router = APIRouter(prefix="/chat", tags=["AI Assistant"])

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    language: Optional[str] = "en"

class ChatSource(BaseModel):
    source_name: str
    url: str
    scheme: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    language: str
    sources: List[ChatSource] = []
    model_used: Optional[str] = None

class MessageHistoryItem(BaseModel):
    id: int
    role: str
    content: str
    sources: List[Dict[str, Any]] = []
    created_at: str

@router.post("", response_model=ChatResponse)
def send_chat_message(
    payload: ChatRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    session_id = payload.session_id or str(uuid.uuid4())
    user_id = current_user.id if current_user else None

    # Find or create conversation
    conv = db.query(Conversation).filter(Conversation.session_id == session_id).first()
    if not conv:
        conv = Conversation(
            user_id=user_id,
            session_id=session_id,
            title=payload.message[:50],
            language=payload.language or "en"
        )
        db.add(conv)
        db.flush()

    # Save user message
    user_msg = ChatMessage(
        conversation_id=conv.id,
        role="user",
        content=payload.message
    )
    db.add(user_msg)

    # Generate grounded RAG response
    rag_result = rag_engine.generate_response(
        query=payload.message,
        language=payload.language or (current_user.preferred_language if current_user else "en")
    )

    # Save assistant message with official citations
    assistant_msg = ChatMessage(
        conversation_id=conv.id,
        role="assistant",
        content=rag_result["response"],
        sources=rag_result["sources"]
    )
    db.add(assistant_msg)
    db.commit()

    return {
        "response": rag_result["response"],
        "session_id": session_id,
        "language": rag_result["language"],
        "sources": rag_result["sources"],
        "model_used": rag_result.get("model_used")
    }

@router.get("/history")
def get_chat_history(
    session_id: Optional[str] = Query(None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if not session_id and not current_user:
        return {"messages": []}

    query = db.query(Conversation)
    if session_id:
        conv = query.filter(Conversation.session_id == session_id).first()
    elif current_user:
        conv = query.filter(Conversation.user_id == current_user.id).order_by(Conversation.updated_at.desc()).first()
    else:
        conv = None

    if not conv:
        return {"messages": []}

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.conversation_id == conv.id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )

    return {
        "session_id": conv.session_id,
        "messages": [
            {
                "id": m.id,
                "role": m.role,
                "content": m.content,
                "sources": m.sources or [],
                "created_at": m.created_at.isoformat()
            }
            for m in messages
        ]
    }

@router.delete("/history")
def clear_chat_history(
    session_id: str = Query(...),
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(Conversation.session_id == session_id).first()
    if conv:
        db.delete(conv)
        db.commit()
    return {"message": "Chat history cleared successfully"}
