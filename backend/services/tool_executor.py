"""Tool Executor - Validates and executes AI tool calls safely"""
from dataclasses import dataclass
from typing import Optional, Any
from datetime import datetime, date, timedelta, time
from database import get_db
from models import Appointment, User
from sqlalchemy.orm import Session


@dataclass
class ToolResult:
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
    message: Optional[str] = None


class ToolValidator:
    DURATION_MAP = {"checkup": 30, "cleaning": 45, "emergency": 30, "consultation": 45, "follow_up": 20, "other": 30}
    CLINIC_START_HOUR = 9
    CLINIC_END_HOUR = 17
    
    def __init__(self, db: Session):
        self.db = db
    
    def validate_dentist(self, dentist_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.id == dentist_id, User.role == "dentist").first()
    
    def validate_patient(self, patient_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.id == patient_id, User.role == "patient").first()
    
    def validate_date_format(self, date_str: str) -> Optional[date]:
        try:
            return datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return None
    
    def validate_future_date(self, date_str: str) -> Optional[date]:
        d = self.validate_date_format(date_str)
        return d if d and d >= date.today() else None
    
    def validate_time_format(self, time_str: str) -> Optional[time]:
        try:
            return datetime.strptime(time_str, "%H:%M").time()
        except ValueError:
            return None
    
    def validate_business_hours(self, time_str: str) -> Optional[time]:
        t = self.validate_time_format(time_str)
        return t if t and self.CLINIC_START_HOUR <= t.hour < self.CLINIC_END_HOUR else None
    
    def validate_appointment_type(self, apt_type: str) -> Optional[str]:
        valid = ["checkup", "cleaning", "emergency", "consultation", "follow_up", "other"]
        return apt_type if apt_type in valid else None
    
    def check_conflict(self, dentist_id: str, apt_date: date, start_time: time, 
                       duration_minutes: int, exclude_id: Optional[str] = None) -> bool:
        start_dt = datetime.combine(apt_date, start_time)
        end_dt = start_dt + timedelta(minutes=duration_minutes)
        
        query = self.db.query(Appointment).filter(
            Appointment.dentist_id == dentist_id,
            Appointment.status.in_(["scheduled", "confirmed"]),
            Appointment.appointment_date == apt_date
        )
        if exclude_id:
            query = query.filter(Appointment.id != exclude_id)
        
        for apt in query.all():
            apt_start = datetime.strptime(apt.start_time, "%H:%M").time()
            apt_end = datetime.strptime(apt.end_time, "%H:%M").time()
            if not (end_dt.time() <= apt_start or start_dt.time() >= apt_end):
                return True
        return False
    
    def get_appointment_by_id(self, appointment_id: str) -> Optional[Appointment]:
        return self.db.query(Appointment).filter(Appointment.id == appointment_id).first()
    
    def validate_ownership(self, appointment: Appointment, user_id: str, user_role: str) -> bool:
        return user_role in ["admin", "dentist"] or appointment.patient_id == user_id
 


class AppointmentToolExecutor:
    def __init__(self, db: Session):
        self.db = db
        self.validator = ToolValidator(db)
    
    def check_available_slots(self, user_id: str, user_role: str, date: str,
                              dentist_id: Optional[str] = None, appointment_type: Optional[str] = None) -> ToolResult:
        apt_date = self.validator.validate_future_date(date)
        if not apt_date:
            return ToolResult(success=False, error="Invalid or past date")
        
        if dentist_id:
            dentist = self.validator.validate_dentist(dentist_id)
            if not dentist:
                return ToolResult(success=False, error="Dentist not found")
            dentists = [dentist]
        else:
            dentists = self.db.query(User).filter(User.role == "dentist").all()
        
        if not dentists:
            return ToolResult(success=False, error="No dentists available")
        
        duration = ToolValidator.DURATION_MAP.get(appointment_type, 30) if appointment_type else 30
        slots = []


    def get_appointment(self, user_id: str, user_role: str, appointment_id: str) -> ToolResult:
        apt = self.validator.get_appointment_by_id(appointment_id)
        if not apt:
            return ToolResult(success=False, error="Appointment not found")
        if not self.validator.validate_ownership(apt, user_id, user_role):
            return ToolResult(success=False, error="Unauthorized to view this appointment")
        
        return ToolResult(success=True, data={
            "id": apt.id, "patient_id": apt.patient_id,
            "patient_name": apt.patient.full_name if apt.patient else None,
            "dentist_id": apt.dentist_id,
            "dentist_name": apt.dentist.full_name if apt.dentist else None,
            "date": apt.appointment_date.strftime("%Y-%m-%d") if apt.appointment_date else None,
            "start_time": apt.start_time, "end_time": apt.end_time,
            "type": apt.appointment_type, "status": apt.status, "notes": apt.notes
        })
    
    def create_appointment(self, user_id: str, user_role: str, patient_id: str, dentist_id: str,
                          date: str, start_time: str, appointment_type: str,
                          notes: Optional[str] = None) -> ToolResult:
        import uuid
        
        dentist = self.validator.validate_dentist(dentist_id)
        if not dentist:
            return ToolResult(success=False, error="Invalid dentist ID")
        
        if user_role == "patient" and patient_id != user_id:
            return ToolResult(success=False, error="You can only book for yourself")
        
        patient = self.validator.validate_patient(patient_id)
        if not patient:
            return ToolResult(success=False, error="Invalid patient ID")
        
        apt_date = self.validator.validate_future_date(date)
        if not apt_date:
            return ToolResult(success=False, error="Invalid or past date")
        
        apt_start = self.validator.validate_business_hours(start_time)


    def reschedule_appointment(self, user_id: str, user_role: str,
                              appointment_id: str, new_date: str, new_start_time: str) -> ToolResult:
        apt = self.validator.get_appointment_by_id(appointment_id)
        if not apt:
            return ToolResult(success=False, error="Appointment not found")
        if not self.validator.validate_ownership(apt, user_id, user_role):
            return ToolResult(success=False, error="Unauthorized")
        if apt.status == "cancelled":
            return ToolResult(success=False, error="Cannot reschedule cancelled appointment")
        
        apt_date = self.validator.validate_future_date(new_date)
        if not apt_date:
            return ToolResult(success=False, error="Invalid or past date")
        
        apt_start = self.validator.validate_business_hours(new_start_time)
        if not apt_start:
            return ToolResult(success=False, error="Time must be between 9:00 and 17:00")
        
        duration = ToolValidator.DURATION_MAP.get(apt.appointment_type, 30)
        end_time = (datetime.combine(apt_date, apt_start) + timedelta(minutes=duration)).strftime("%H:%M")
        
        if self.validator.check_conflict(apt.dentist_id, apt_date, apt_start, duration, appointment_id):
            return ToolResult(success=False, error="New time conflicts with existing appointment")
        
        apt.appointment_date = apt_date
        apt.start_time = new_start_time
        apt.end_time = end_time
        apt.updated_at = datetime.utcnow()
        self.db.commit()
        
        return ToolResult(success=True, data={
            "id": apt.id, "date": new_date, "start_time": new_start_time, "end_time": end_time
        }, message=f"Rescheduled to {new_date} at {new_start_time}")
    
    def cancel_appointment(self, user_id: str, user_role: str,
                           appointment_id: str, reason: Optional[str] = None) -> ToolResult:
        apt = self.validator.get_appointment_by_id(appointment_id)
        if not apt:
            return ToolResult(success=False, error="Appointment not found")
        if not self.validator.validate_ownership(apt, user_id, user_role):
            return ToolResult(success=False, error="Unauthorized")
        if apt.status == "cancelled":
            return ToolResult(success=False, error="Already cancelled")
        
        apt.status = "cancelled"
        if reason:
            apt.notes = f"{apt.notes or ''}\nCancellation: {reason}".strip()
        apt.updated_at = datetime.utcnow()
        self.db.commit()
        
        return ToolResult(success=True, data={"id": apt.id, "status": "cancelled"},
                        message="Appointment cancelled successfully")
    
    def get_dentist_schedule(self, user_id: str, user_role: str, dentist_id: str, date: str) -> ToolResult:
        dentist = self.validator.validate_dentist(dentist_id)
        if not dentist:
            return ToolResult(success=False, error="Dentist not found")
        
        apt_date = self.validator.validate_date_format(date)
        if not apt_date:
            return ToolResult(success=False, error="Invalid date format")
        
        appointments = self.db.query(Appointment).filter(
            Appointment.dentist_id == dentist_id, Appointment.appointment_date == apt_date,
            Appointment.status.in_(["scheduled", "confirmed"])
        ).order_by(Appointment.start_time).all()
        
        schedule = [{"id": a.id, "patient_name": a.patient.full_name if a.patient else "Unknown",
            "start_time": a.start_time, "end_time": a.end_time,
            "type": a.appointment_type, "status": a.status} for a in appointments]
        
        return ToolResult(success=True, data={
            "dentist_id": dentist_id, "dentist_name": dentist.full_name,
            "date": date, "appointments": schedule, "count": len(schedule)
        })
    
    def get_patient_appointments(self, user_id: str, user_role: str,
                                 patient_id: str, status: Optional[str] = None) -> ToolResult:
        if user_role == "patient" and patient_id != user_id:
            return ToolResult(success=False, error="Can only view your appointments")
        
        patient = self.db.query(User).filter(User.id == patient_id, User.role == "patient").first()
        if not patient:
            return ToolResult(success=False, error="Patient not found")
        
        query = self.db.query(Appointment).filter(Appointment.patient_id == patient_id)
        if status and status != "all":
            query = query.filter(Appointment.status == status)
        
        appointments = query.order_by(Appointment.appointment_date.desc()).all()
        result = [{"id": a.id, "dentist_name": a.dentist.full_name if a.dentist else "Unknown",
            "date": a.appointment_date.strftime("%Y-%m-%d") if a.appointment_date else None,
            "start_time": a.start_time, "type": a.appointment_type, "status": a.status} for a in appointments]
        
        return ToolResult(success=True, data={
            "patient_id": patient_id, "patient_name": patient.full_name,
            "appointments": result, "count": len(result)
        })
        if not apt_start:
            return ToolResult(success=False, error="Time must be between 9:00 and 17:00")
        
        apt_type = self.validator.validate_appointment_type(appointment_type)
        if not apt_type:
            return ToolResult(success=False, error="Invalid appointment type")
        
        duration = ToolValidator.DURATION_MAP.get(apt_type, 30)
        end_time = (datetime.combine(apt_date, apt_start) + timedelta(minutes=duration)).strftime("%H:%M")
        
        if self.validator.check_conflict(dentist_id, apt_date, apt_start, duration):
            return ToolResult(success=False, error="Time slot conflicts with existing appointment")
        
        appointment = Appointment(
            id=str(uuid.uuid4()), patient_id=patient_id, dentist_id=dentist_id,
            appointment_date=apt_date, start_time=start_time, end_time=end_time,
            appointment_type=apt_type, status="scheduled", notes=notes
        )
        
        self.db.add(appointment)
        self.db.commit()
        self.db.refresh(appointment)
        
        return ToolResult(success=True, data={
            "id": appointment.id, "patient_id": patient_id, "patient_name": patient.full_name,
            "dentist_id": dentist_id, "dentist_name": dentist.full_name,
            "date": date, "start_time": start_time, "end_time": end_time,
            "type": appointment_type, "status": "scheduled",
            "message": f"Appointment confirmed with Dr. {dentist.full_name} on {date} at {start_time}"
        }, message=f"Booked for {date} at {start_time}")
        
        for dentist in dentists:
            booked = self.db.query(Appointment).filter(
                Appointment.dentist_id == dentist.id, Appointment.appointment_date == apt_date,
                Appointment.status.in_(["scheduled", "confirmed"])
            ).all()
            
            booked_times = [(datetime.strptime(a.start_time, "%H:%M").time(),
                           datetime.strptime(a.end_time, "%H:%M").time()) for a in booked]
            
            for hour in range(ToolValidator.CLINIC_START_HOUR, ToolValidator.CLINIC_END_HOUR):
                for minute in [0, 30]:
                    slot_start = time(hour, minute)
                    slot_end_dt = datetime.combine(apt_date, slot_start) + timedelta(minutes=duration)
                    slot_end = slot_end_dt.time()
                    
                    if slot_end_dt.hour > ToolValidator.CLINIC_END_HOUR:
                        continue
                    
                    is_available = True
                    for bs, be in booked_times:
                        if not (slot_end <= bs or slot_start >= be):
                            is_available = False
                            break
                    
                    if is_available:
                        slots.append({"dentist_id": dentist.id, "dentist_name": dentist.full_name,
                            "date": date, "start_time": slot_start.strftime("%H:%M"),
                            "end_time": slot_end.strftime("%H:%M"), "type": appointment_type or "checkup"})
        
        return ToolResult(success=True, data={"slots": slots, "count": len(slots)},
                        message=f"Found {len(slots)} slots" if slots else "No slots available")
 
