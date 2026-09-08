"""
Conversation schemas.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class MessageBase(BaseModel):
    content: str


class MessageResponse(MessageBase):
    id: str
    role: str
    created_at: datetime


class ConversationCreate(BaseModel):
    pass


class ConversationResponse(BaseModel):
    id: str
    patient_id: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    status: str
    messages: List[MessageResponse] = []


class SendMessageRequest(BaseModel):
    content: str = Field(..., min_length=1)
    role: str = "user"
