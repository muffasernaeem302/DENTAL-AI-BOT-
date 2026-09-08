"""
Patient intake schemas.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PatientIntakeBase(BaseModel):
    chief_complaint: Optional[str] = None
    duration: Optional[str] = None
    reported_pain_score: Optional[int] = Field(None, ge=0, le=10)
    swelling_reported: bool = False
    bleeding_reported: bool = False
    fever_reported: bool = False
    sensitivity_reported: bool = False
    additional_notes: Optional[str] = None


class PatientIntakeCreate(PatientIntakeBase):
    conversation_id: Optional[str] = None


class PatientIntakeUpdate(BaseSchema):
    chief_complaint: Optional[str] = None
    duration: Optional[str] = None
    reported_pain_score: Optional[int] = Field(None, ge=0, le=10)
    swelling_reported: Optional[bool] = None
    bleeding_reported: Optional[bool] = None
    fever_reported: Optional[bool] = None
    sensitivity_reported: Optional[bool] = None
    additional_notes: Optional[str] = None


class PatientIntakeResponse(PatientIntakeBase):
    id: str
    patient_id: str
    conversation_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

from schemas import BaseSchema
