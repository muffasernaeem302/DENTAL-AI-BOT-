"""Patient endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
from datetime import datetime
from database import get_db
from models import User, PatientProfile
from schemas import UserRole
from .auth import get_current_user, require_role

router = APIRouter()

@router.get("/")
async def list_patients(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role("admin", "receptionist", "dentist"))):
    result = await db.execute(select(User).where(User.role == UserRole.PATIENT.value))
    patients = result.scalars().all()
    return [{"id": p.id, "full_name": p.full_name, "email": p.email, "phone": p.phone, "role": p.role, "created_at": str(p.created_at), "updated_at": str(p.updated_at)} for p in patients]

@router.get("/{patient_id}")
async def get_patient(patient_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN.value, UserRole.RECEPTIONIST.value, UserRole.DENTIST.value]:
        if current_user.id != patient_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only access your own records")
    result = await db.execute(select(User).where(User.id == patient_id, User.role == UserRole.PATIENT.value))
    patient = result.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    profile_result = await db.execute(select(PatientProfile).where(PatientProfile.user_id == patient_id))
    profile = profile_result.scalar_one_or_none()
    response = {"id": patient.id, "full_name": patient.full_name, "email": patient.email, "phone": patient.phone, "role": patient.role, "created_at": str(patient.created_at), "updated_at": str(patient.updated_at), "profile": None}
    if profile:
        response["profile"] = {"id": profile.id, "user_id": profile.user_id, "date_of_birth": str(profile.date_of_birth) if profile.date_of_birth else None, "emergency_contact": profile.emergency_contact, "created_at": str(profile.created_at), "updated_at": str(profile.updated_at)}
    return response

@router.post("/")
async def create_patient(
    full_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    phone: str | None = Form(None),
    date_of_birth: str | None = Form(None),
    emergency_contact: str | None = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin", "receptionist"))
):
    result = await db.execute(select(User).where(User.email == email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    from core.security import create_password_hash
    user_id = str(uuid.uuid4())
    user = User(id=user_id, full_name=full_name, email=email, phone=phone, role=UserRole.PATIENT.value, password_hash=create_password_hash(password))
    db.add(user)
    profile = PatientProfile(id=str(uuid.uuid4()), user_id=user_id, date_of_birth=datetime.fromisoformat(date_of_birth) if date_of_birth else None, emergency_contact=emergency_contact)
    db.add(profile)
    await db.commit()
    await db.refresh(user)
    return {"id": user.id, "full_name": user.full_name, "email": user.email, "phone": user.phone, "role": user.role, "created_at": str(user.created_at), "updated_at": str(user.updated_at), "profile": {"id": profile.id, "user_id": profile.user_id, "date_of_birth": str(profile.date_of_birth) if profile.date_of_birth else None, "emergency_contact": profile.emergency_contact, "created_at": str(profile.created_at), "updated_at": str(profile.updated_at)}}