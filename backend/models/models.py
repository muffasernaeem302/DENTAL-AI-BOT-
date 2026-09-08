"""SQLAlchemy models for DentalAI"""
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(50))
    role = Column(String(50), nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    patient_profile = relationship("PatientProfile", back_populates="user", uselist=False)
    dentist_profile = relationship("DentistProfile", back_populates="user", uselist=False)
    patient_appointments = relationship("Appointment", foreign_keys="Appointment.patient_id", back_populates="patient")
    dentist_appointments = relationship("Appointment", foreign_keys="Appointment.dentist_id", back_populates="dentist")
    conversations = relationship("PatientConversation", back_populates="patient")
    intakes = relationship("PatientIntake", back_populates="patient")


class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True)
    date_of_birth = Column(DateTime)
    emergency_contact = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="patient_profile")


class DentistProfile(Base):
    __tablename__ = "dentist_profiles"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True)
    specialization = Column(String(255))
    license_reference = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="dentist_profile")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String(36), primary_key=True)
    patient_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    dentist_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    appointment_date = Column(DateTime, nullable=False)
    start_time = Column(String(10), nullable=False)
    end_time = Column(String(10), nullable=False)
    appointment_type = Column(String(100), nullable=False)
    status = Column(String(50), default="scheduled")
    notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    patient = relationship("User", foreign_keys=[patient_id], back_populates="patient_appointments")
    dentist = relationship("User", foreign_keys=[dentist_id], back_populates="dentist_appointments")


class PatientConversation(Base):
    __tablename__ = "patient_conversations"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), default="New Conversation")
    status = Column(String(50), default="active")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    patient = relationship("User", back_populates="conversations")
    messages = relationship("ConversationMessage", back_populates="conversation", order_by="ConversationMessage.created_at")


class ConversationMessage(Base):
    __tablename__ = "conversation_messages"

    id = Column(String(36), primary_key=True)
    conversation_id = Column(String(36), ForeignKey("patient_conversations.id"), nullable=False)
    role = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    conversation = relationship("PatientConversation", back_populates="messages")


class PatientIntake(Base):
    __tablename__ = "patient_intakes"

    id = Column(String(36), primary_key=True)
    patient_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    conversation_id = Column(String(36), ForeignKey("patient_conversations.id"))
    chief_complaint = Column(Text)
    medical_history = Column(Text)
    allergies = Column(Text)
    medications = Column(Text)
    duration = Column(String(255))
    reported_pain_score = Column(Integer)
    swelling_reported = Column(Boolean, default=False)
    bleeding_reported = Column(Boolean, default=False)
    fever_reported = Column(Boolean, default=False)
    sensitivity_reported = Column(Boolean, default=False)
    additional_notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    patient = relationship("User", back_populates="intakes")
    conversation = relationship("PatientConversation")
 
