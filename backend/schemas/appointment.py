"""
Appointment schemas.
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
import re


def validate_time(v: str) -> str:
    if not re.match(r'^([01]?[0-9]|2[0-3]):[0-5][0-9]$', v):
        raise ValueError('Time must be in HH:MM format')
    return v


class AppointmentBase(BaseSchema):
    dentist_id: str
    appointment_date: datetime
    start_time: str
    end_time: str
    appointment_type: str = Field(..., min_length=1, max_length=100)
    notes: Optional[str] = None
    
    @field_validator('start_time', 'end_time')
    @classmethod
    def validate_time(cls, v):
        return validate_time(v)


class AppointmentCreate(AppointmentBase):
    patient_id: str


class AppointmentUpdate(BaseSchema):
    dentist_id: Optional[str] = None
    appointment_date: Optional[datetime] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    appointment_type: Optional[str] = Field(None, max_length=100)
    status: Optional[str] = None
    notes: Optional[str] = None
    
    @field_validator('start_time', 'end_time')
    @classmethod
    def validate_time(cls, v):
        if v is not None:
            return validate_time(v)
        return v


class AppointmentResponse(AppointmentBase):
    id: str
    patient_id: str
    status: str
    created_at: datetime
    updated_at: datetime
    patient_name: Optional[str] = None
    dentist_name: Optional[str] = None

from schemas import BaseSchema
