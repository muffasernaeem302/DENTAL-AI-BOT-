"""AI Chat API endpoints"""
from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
from database import get_db
from models import User, PatientConversation, ConversationMessage
from ..auth import get_current_user
from agents import orchestrator, AGENT_MAP, TargetAgent

router = APIRouter()

def build_patient_context(user: User) -> dict:
    """Build patient context from user data"""
    return {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "role": user.role
    }

@router.post("/chat")
async def chat(
    message: str = Form(...),
    conversation_id: str | None = Form(None),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Process a chat message through the AI orchestrator."""
    conversation = None
    history = []
    
    if conversation_id:
        result = await db.execute(
            select(PatientConversation).where(
                PatientConversation.id == conversation_id,
                PatientConversation.user_id == user.id
            )
        )
        conversation = result.scalar_one_or_none()
        
        if conversation:
            msg_result = await db.execute(
                select(ConversationMessage)
                .where(ConversationMessage.conversation_id == conversation_id)
                .order_by(ConversationMessage.created_at)
            )
            history = [{"role": m.role, "content": m.content} for m in msg_result.scalars().all()]
    
    if not conversation:
        conversation = PatientConversation(
            id=str(uuid.uuid4()),
            user_id=user.id,
            title=f"Chat: {message[:50]}..." if len(message) > 50 else f"Chat: {message}"
        )
        db.add(conversation)
        await db.flush()
    
    user_msg = ConversationMessage(id=str(uuid.uuid4()), conversation_id=conversation.id, role="user", content=message)
    db.add(user_msg)
    await db.commit()
    
    patient_context = build_patient_context(user)
    route_result = await orchestrator.route(message, history, patient_context)
    
    if route_result.target_agent and route_result.target_agent in AGENT_MAP:
        agent = AGENT_MAP[route_result.target_agent]
        agent_response = await agent.process(message, {"conversation_history": history, "patient_context": patient_context})
    else:
        agent_response = None
    
    response_text = agent_response.message if agent_response else f"I've noted your message about {message[:50]}... A staff member will respond shortly."
    
    ai_msg = ConversationMessage(id=str(uuid.uuid4()), conversation_id=conversation.id, role="assistant", content=response_text)
    db.add(ai_msg)
    await db.commit()
    
    return {
        "message": response_text,
        "intent": route_result.intent.value,
        "agent": agent_response.agent if agent_response else "orchestrator",
        "confidence": route_result.confidence,
        "urgency_level": route_result.urgency_level,
        "conversation_id": conversation.id
    }

@router.get("/chat/{conversation_id}")
async def get_conversation(conversation_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    """Get conversation history"""
    result = await db.execute(select(PatientConversation).where(PatientConversation.id == conversation_id, PatientConversation.user_id == user.id))
    conversation = result.scalar_one_or_none()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    msg_result = await db.execute(select(ConversationMessage).where(ConversationMessage.conversation_id == conversation_id).order_by(ConversationMessage.created_at))
    messages = [{"id": m.id, "role": m.role, "content": m.content, "created_at": str(m.created_at)} for m in msg_result.scalars().all()]
    
    return {"id": conversation.id, "title": conversation.title, "status": conversation.status, "messages": messages}

@router.get("/chat")
async def list_conversations(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    """List user's conversations"""
    result = await db.execute(select(PatientConversation).where(PatientConversation.user_id == user.id).order_by(PatientConversation.updated_at.desc()))
    return [{"id": c.id, "title": c.title, "status": c.status, "created_at": str(c.created_at), "updated_at": str(c.updated_at)} for c in result.scalars().all()]
 
