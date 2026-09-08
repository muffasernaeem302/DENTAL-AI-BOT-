"""
Pydantic schemas for DentalAI API.
"""
from enum import Enum


class UserRole(str, Enum):
    """User role enumeration."""
    ADMIN = "admin"
    DENTIST = "dentist"
    RECEPTIONIST = "receptionist"
    PATIENT = "patient"


class AppointmentStatus(str, Enum):
    """Appointment status enumeration."""
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class ConversationStatus(str, Enum):
    """Conversation status enumeration."""
    ACTIVE = "active"
    CLOSED = "closed"


__all__ = ["UserRole", "AppointmentStatus", "ConversationStatus"]
 
