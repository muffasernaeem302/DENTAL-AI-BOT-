"""Appointment endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import uuid
from datetime import datetime
from database import get_db
from models import User, Appointment
from schemas import UserRole, AppointmentStatus
from .auth import get_current_user

router = APIRouter()

def fmt(apt, p=None, d=None):
    return {"id": apt.id, "patient_id": apt.patient_id, "dentist_id": apt.dentist_id, "date": str(apt.appointment_date), "start": apt.start_time, "end": apt.end_time, "type": apt.appointment_type, "status": apt.status, "notes": apt.notes, "patient_name": p.full_name if p else None, "dentist_name": d.full_name if d else None}

@router.get("/")
async def list_appointments(patient_id: Optional[str] = Query(None), dentist_id: Optional[str] = Query(None), status: Optional[str] = Query(None), db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    q = select(Appointment)
    if user.role == UserRole.PATIENT.value: q = q.where(Appointment.patient_id == user.id)
    elif user.role == UserRole.DENTIST.value: q = q.where(Appointment.dentist_id == user.id)
    if patient_id: q = q.where(Appointment.patient_id == patient_id)
    if dentist_id: q = q.where(Appointment.dentist_id == dentist_id)
    if status: q = q.where(Appointment.status == status)
    result = await db.execute(q.order_by(Appointment.appointment_date.desc()))
    return [fmt(apt) for apt in result.scalars().all()]

@router.post("/")
async def create_appointment(patient_id: str = Form(...), dentist_id: str = Form(...), appointment_date: str = Form(...), start_time: str = Form(...), end_time: str = Form(...), appointment_type: str = Form(...), notes: Optional[str] = Form(None), db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    if user.role == UserRole.PATIENT.value and user.id != patient_id: raise HTTPException(status_code=403, detail="Patients can only create appointments for themselves")
    d = await db.execute(select(User).where(User.id == dentist_id, User.role == UserRole.DENTIST.value))
    p = await db.execute(select(User).where(User.id == patient_id, User.role == UserRole.PATIENT.value))
    dentist, patient = d.scalar_one_or_none(), p.scalar_one_or_none()
    if not dentist: raise HTTPException(status_code=400, detail="Invalid dentist ID")
    if not patient: raise HTTPException(status_code=400, detail="Invalid patient ID")
    apt = Appointment(id=str(uuid.uuid4()), patient_id=patient_id, dentist_id=dentist_id, appointment_date=datetime.fromisoformat(appointment_date), start_time=start_time, end_time=end_time, appointment_type=appointment_type, status=AppointmentStatus.SCHEDULED.value, notes=notes)
    db.add(apt); await db.commit(); await db.refresh(apt)
    return fmt(apt, patient, dentist)

@router.get("/{appointment_id}")
async def get_appointment(appointment_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Appointment).where(Appointment.id == appointment_id))
    apt = result.scalar_one_or_none()
    if not apt: raise HTTPException(status_code=404, detail="Appointment not found")
    if user.role == UserRole.PATIENT.value and user.id != apt.patient_id: raise HTTPException(status_code=403, detail="You can only access your own appointments")
    p = await db.execute(select(User).where(User.id == apt.patient_id))
    d = await db.execute(select(User).where(User.id == apt.dentist_id))
    return fmt(apt, p.scalar_one_or_none(), d.scalar_one_or_none())

@router.patch("/{appointment_id}")
async def update_appointment(appointment_id: str, dentist_id: Optional[str] = Form(None), appointment_date: Optional[str] = Form(None), start_time: Optional[str] = Form(None), end_time: Optional[str] = Form(None), appointment_type: Optional[str] = Form(None), status: Optional[str] = Form(None), notes: Optional[str] = Form(None), db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Appointment).where(Appointment.id == appointment_id))
    apt = result.scalar_one_or_none()
    if not apt: raise HTTPException(status_code=404, detail="Appointment not found")
    if user.role == UserRole.PATIENT.value:
        if user.id != apt.patient_id: raise HTTPException(status_code=403, detail="You can only update your own appointments")
        if status and status != AppointmentStatus.CANCELLED.value: raise HTTPException(status_code=403, detail="Patients can only cancel")
    if dentist_id: apt.dentist_id = dentist_id
    if appointment_date: apt.appointment_date = datetime.fromisoformat(appointment_date)
    if start_time: apt.start_time = start_time
    if end_time: apt.end_time = end_time
    if appointment_type: apt.appointment_type = appointment_type
    if status: apt.status = status
    if notes is not None: apt.notes = notes
    await db.commit(); await db.refresh(apt)
    p = await db.execute(select(User).where(User.id == apt.patient_id))
    d = await db.execute(select(User).where(User.id == apt.dentist_id))
    return fmt(apt, p.scalar_one_or_none(), d.scalar_one_or_none())

@router.delete("/{appointment_id}")
async def cancel_appointment(appointment_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Appointment).where(Appointment.id == appointment_id))
    apt = result.scalar_one_or_none()
    if not apt: raise HTTPException(status_code=404, detail="Appointment not found")
    if user.role == UserRole.PATIENT.value and user.id != apt.patient_id: raise HTTPException(status_code=403, detail="You can only cancel your own appointments")
    apt.status = AppointmentStatus.CANCELLED.value
    await db.commit()
    return {"success": True, "message": "Appointment cancelled"}