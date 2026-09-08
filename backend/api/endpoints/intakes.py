"""Patient Intake API endpoints"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import uuid
from database import get_db
from models import User, PatientIntake
from .auth import get_current_user

router = APIRouter()

class IntakeData(BaseModel):
    chief_complaint: Optional[str] = None
    location: Optional[str] = None
    duration: Optional[str] = None
    pain_level: Optional[int] = None
    swelling: Optional[bool] = None
    bleeding: Optional[bool] = None
    sensitivity: Optional[bool] = None
    difficulty_chewing: Optional[bool] = None
    fever: Optional[bool] = None
    recent_procedure: Optional[str] = None
    notes: Optional[str] = None

class IntakeCreate(BaseModel):
    appointment_id: Optional[str] = None
    conversation_id: Optional[str] = None
    intake_data: IntakeData
    flags_for_dentist: list = []
    is_complete: bool = False

@router.post("/")
async def create_intake(intake: IntakeCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    """Create or update patient intake data"""
    intake_record = PatientIntake(
        id=str(uuid.uuid4()), patient_id=user.id, appointment_id=intake.appointment_id,
        conversation_id=intake.conversation_id, chief_complaint=intake.intake_data.chief_complaint,
        location=intake.intake_data.location, duration=intake.intake_data.duration,
        reported_pain_score=intake.intake_data.pain_level, swelling_reported=bool(intake.intake_data.swelling),
        bleeding_reported=bool(intake.intake_data.bleeding), sensitivity_reported=bool(intake.intake_data.sensitivity),
        difficulty_chewing_reported=bool(intake.intake_data.difficulty_chewing), fever_reported=bool(intake.intake_data.fever),
        recent_procedure=intake.intake_data.recent_procedure, additional_notes=intake.intake_data.notes,
        flags_for_dentist=intake.flags_for_dentist, is_complete=intake.is_complete,
        structured_data=intake.intake_data.model_dump()
    )
    db.add(intake_record)
    await db.commit()
    await db.refresh(intake_record)
    return {"id": intake_record.id, "success": True}

@router.get("/")
async def get_patient_intakes(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    """Get all intakes for current patient"""
    result = await db.execute(select(PatientIntake).where(PatientIntake.patient_id == user.id).order_by(PatientIntake.created_at.desc()))
    intakes = result.scalars().all()
    return [_intake_to_dict(i) for i in intakes]

@router.get("/latest")
async def get_latest_intake(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    """Get the most recent intake for current patient"""
    result = await db.execute(select(PatientIntake).where(PatientIntake.patient_id == user.id).order_by(PatientIntake.created_at.desc()).limit(1))
    intake = result.scalar_one_or_none()
    if not intake:
        raise HTTPException(status_code=404, detail="No intake found")
    return _intake_to_dict(intake)

@router.get("/dentist/{patient_id}")
async def get_patient_intakes_for_dentist(patient_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    """Get all intakes for a specific patient (dentist view)"""
    if user.role != "dentist":
        raise HTTPException(status_code=403, detail="Only dentists can view patient intakes")
    result = await db.execute(select(PatientIntake).where(PatientIntake.patient_id == patient_id).order_by(PatientIntake.created_at.desc()))
    return [_intake_to_dict(i) for i in result.scalars().all()]

@router.get("/dentist/{patient_id}/latest")
async def get_latest_patient_intake_for_dentist(patient_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    """Get the most recent intake for a specific patient (dentist view)"""
    if user.role != "dentist":
        raise HTTPException(status_code=403, detail="Only dentists can view patient intakes")
    result = await db.execute(select(PatientIntake).where(PatientIntake.patient_id == patient_id).order_by(PatientIntake.created_at.desc()).limit(1))
    intake = result.scalar_one_or_none()
    if not intake:
        raise HTTPException(status_code=404, detail="No intake found for this patient")
    return _intake_to_dict(intake)

def _intake_to_dict(intake: PatientIntake) -> dict:
    return {"id": intake.id, "patient_id": intake.patient_id, "chief_complaint": intake.chief_complaint, "location": intake.location, "duration": intake.duration, "pain_level": intake.reported_pain_score, "swelling_reported": intake.swelling_reported, "bleeding_reported": intake.bleeding_reported, "sensitivity_reported": intake.sensitivity_reported, "difficulty_chewing_reported": intake.difficulty_chewing_reported, "fever_reported": intake.fever_reported, "recent_procedure": intake.recent_procedure, "additional_notes": intake.additional_notes, "flags_for_dentist": intake.flags_for_dentist or [], "is_complete": intake.is_complete, "structured_data": intake.structured_data or {}, "created_at": str(intake.created_at)}
 
