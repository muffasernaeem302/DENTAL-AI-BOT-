"""Conversation endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import uuid
from database import get_db
from models import User, PatientConversation, ConversationMessage
from schemas import UserRole
from .auth import get_current_user

router = APIRouter()

@router.get("/")
async def list_conversations(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(PatientConversation).where(PatientConversation.user_id == user.id))
    return [{"id": c.id, "user_id": c.user_id, "title": c.title, "status": c.status, "created_at": str(c.created_at), "updated_at": str(c.updated_at)} for c in result.scalars().all()]

@router.post("/")
async def create_conversation(title: Optional[str] = Form(None), db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    conv = PatientConversation(id=str(uuid.uuid4()), user_id=user.id, title=title or "Conversation")
    db.add(conv); await db.commit(); await db.refresh(conv)
    return {"id": conv.id, "user_id": conv.user_id, "title": conv.title, "status": conv.status, "created_at": str(conv.created_at), "updated_at": str(conv.updated_at)}

@router.get("/{conversation_id}")
async def get_conversation(conversation_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(PatientConversation).where(PatientConversation.id == conversation_id))
    conv = result.scalar_one_or_none()
    if not conv: raise HTTPException(status_code=404, detail="Conversation not found")
    if user.role == UserRole.PATIENT.value and conv.user_id != user.id: raise HTTPException(status_code=403, detail="You can only access your own conversations")
    msg_result = await db.execute(select(ConversationMessage).where(ConversationMessage.conversation_id == conversation_id).order_by(ConversationMessage.created_at))
    messages = [{"id": m.id, "conversation_id": m.conversation_id, "role": m.role, "content": m.content, "created_at": str(m.created_at)} for m in msg_result.scalars().all()]
    return {"id": conv.id, "user_id": conv.user_id, "title": conv.title, "status": conv.status, "created_at": str(conv.created_at), "updated_at": str(conv.updated_at), "messages": messages}

@router.delete("/{conversation_id}")
async def delete_conversation(conversation_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(PatientConversation).where(PatientConversation.id == conversation_id))
    conv = result.scalar_one_or_none()
    if not conv: raise HTTPException(status_code=404, detail="Conversation not found")
    if user.role == UserRole.PATIENT.value and conv.user_id != user.id: raise HTTPException(status_code=403, detail="You can only delete your own conversations")
    msg_result = await db.execute(select(ConversationMessage).where(ConversationMessage.conversation_id == conversation_id))
    for msg in msg_result.scalars().all(): await db.delete(msg)
    await db.delete(conv); await db.commit()
    return {"success": True}