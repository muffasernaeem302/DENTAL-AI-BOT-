"""Appointment Tool Definitions - AI-callable appointment management functions"""
from dataclasses import dataclass, field
from typing import Optional, Literal
from datetime import datetime, date, time


@dataclass
class ToolParameter:
    """Tool parameter definition"""
    name: str
    type: str
    description: str
    required: bool = True
    enum: Optional[list] = None


@dataclass
class ToolDefinition:
    """Tool definition for AI agent tool-calling"""
    name: str
    description: str
    parameters: list[ToolParameter] = field(default_factory=list)
    
    def to_openai_format(self) -> dict:
        """Convert to OpenAI function-calling format"""
        props = {}
        required = []
        for p in self.parameters:
            prop = {"type": p.type, "description": p.description}
            if p.enum:
                prop["enum"] = p.enum
            props[p.name] = prop
            if p.required:
                required.append(p.name)
        
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": {
                    "type": "object",
                    "properties": props,
                    "required": required
                }
            }
        }


# Tool Definitions
CHECK_AVAILABLE_SLOTS = ToolDefinition(
    name="check_available_slots",
    description="Check available appointment slots for a specific date and optional dentist",
    parameters=[
        ToolParameter(name="date", type="string", description="Date in YYYY-MM-DD format (e.g., 2026-09-05)"),
        ToolParameter(name="dentist_id", type="string", description="Optional dentist ID. If not provided, shows all dentists.", required=False),
        ToolParameter(name="appointment_type", type="string", description="Type of appointment (checkup, cleaning, emergency, consultation, follow_up, other)", required=False)
    ]
)

GET_APPOINTMENT = ToolDefinition(
    name="get_appointment",
    description="Get details of a specific appointment by ID",
    parameters=[
        ToolParameter(name="appointment_id", type="string", description="The unique appointment ID")
    ]
)

CREATE_APPOINTMENT = ToolDefinition(
    name="create_appointment",
    description="Create a new appointment. Requires user confirmation first.",
    parameters=[
        ToolParameter(name="patient_id", type="string", description="Patient user ID"),
        ToolParameter(name="dentist_id", type="string", description="Dentist user ID"),
        ToolParameter(name="date", type="string", description="Date in YYYY-MM-DD format"),
        ToolParameter(name="start_time", type="string", description="Start time in HH:MM format (24-hour)"),
        ToolParameter(name="appointment_type", type="string", description="Type: checkup, cleaning, emergency, consultation, follow_up, other", enum=["checkup", "cleaning", "emergency", "consultation", "follow_up", "other"]),
        ToolParameter(name="notes", type="string", description="Optional notes about the appointment", required=False)
    ]
)

RESCHEDULE_APPOINTMENT = ToolDefinition(
    name="reschedule_appointment",
    description="Reschedule an existing appointment to a new date/time. Requires user confirmation.",
    parameters=[
        ToolParameter(name="appointment_id", type="string", description="The appointment ID to reschedule"),
        ToolParameter(name="new_date", type="string", description="New date in YYYY-MM-DD format"),
        ToolParameter(name="new_start_time", type="string", description="New start time in HH:MM format (24-hour)")
    ]
)

CANCEL_APPOINTMENT = ToolDefinition(
    name="cancel_appointment",
    description="Cancel an existing appointment. Requires user confirmation before executing.",
    parameters=[
        ToolParameter(name="appointment_id", type="string", description="The appointment ID to cancel"),
        ToolParameter(name="reason", type="string", description="Reason for cancellation", required=False)
    ]
)

GET_DENTIST_SCHEDULE = ToolDefinition(
    name="get_dentist_schedule",
    description="Get a dentist's full schedule for a specific date",
    parameters=[
        ToolParameter(name="dentist_id", type="string", description="Dentist user ID"),
        ToolParameter(name="date", type="string", description="Date in YYYY-MM-DD format")
    ]
)

GET_PATIENT_APPOINTMENTS = ToolDefinition(
    name="get_patient_appointments",
    description="Get all appointments for a patient",
    parameters=[
        ToolParameter(name="patient_id", type="string", description="Patient user ID"),
        ToolParameter(name="status", type="string", description="Filter by status: scheduled, completed, cancelled, all", required=False)
    ]
)

# All tools registry
APPOINTMENT_TOOLS = [
    CHECK_AVAILABLE_SLOTS,
    GET_APPOINTMENT,
    CREATE_APPOINTMENT,
    RESCHEDULE_APPOINTMENT,
    CANCEL_APPOINTMENT,
    GET_DENTIST_SCHEDULE,
    GET_PATIENT_APPOINTMENTS,
]

# Map tool names to definitions
TOOL_MAP = {tool.name: tool for tool in APPOINTMENT_TOOLS}
  
