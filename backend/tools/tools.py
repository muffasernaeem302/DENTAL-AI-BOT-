"""
Tool definitions for DentalAI agents.
"""
from typing import Dict, Any, Callable
from pydantic import BaseModel


class ToolDefinition(BaseModel):
    """Definition of a tool available to agents."""
    name: str
    description: str
    parameters: Dict[str, Any]


class ToolResult(BaseModel):
    """Result of a tool execution."""
    success: bool
    data: Any = None
    error: str = None


class BaseTool:
    """Base class for agent tools."""
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
    
    async def execute(self, **kwargs) -> ToolResult:
        """Execute the tool with given parameters."""
        raise NotImplementedError


class AppointmentScheduler(BaseTool):
    """
    Tool for scheduling appointments.
    
    Used by Patient Assistant to help schedule appointments.
    """
    
    def __init__(self):
        super().__init__(
            name="schedule_appointment",
            description="Schedule a new dental appointment"
        )
    
    async def execute(self, patient_id: str, dentist_id: str, date: str, time: str, appointment_type: str) -> ToolResult:
        """
        Schedule an appointment.
        
        In production, this would interact with the database.
        """
        # Mock implementation
        return ToolResult(
            success=True,
            data={
                "appointment_id": f"apt-{hash((patient_id, date, time))}",
                "status": "scheduled",
                "patient_id": patient_id,
                "dentist_id": dentist_id,
                "date": date,
                "time": time,
                "type": appointment_type,
            }
        )


class AppointmentFinder(BaseTool):
    """
    Tool for finding available appointments.
    """
    
    def __init__(self):
        super().__init__(
            name="find_appointments",
            description="Find available appointment slots"
        )
    
    async def execute(self, dentist_id: str, start_date: str, end_date: str) -> ToolResult:
        """
        Find available appointment slots.
        """
        # Mock implementation
        return ToolResult(
            success=True,
            data=[
                {"date": "2026-09-10", "time": "09:00", "available": True},
                {"date": "2026-09-10", "time": "10:30", "available": True},
                {"date": "2026-09-10", "time": "14:00", "available": True},
                {"date": "2026-09-11", "time": "09:00", "available": True},
            ]
        )


class PatientInfoRetriever(BaseTool):
    """
    Tool for retrieving patient information.
    """
    
    def __init__(self):
        super().__init__(
            name="get_patient_info",
            description="Retrieve patient information and history"
        )
    
    async def execute(self, patient_id: str) -> ToolResult:
        """
        Get patient information.
        """
        # Mock implementation
        return ToolResult(
            success=True,
            data={
                "id": patient_id,
                "name": "Sarah Johnson",
                "email": "sarah.johnson@email.com",
                "allergies": ["Penicillin"],
                "last_visit": "2026-09-03",
                "insurance": "Delta Dental",
            }
        )


def get_all_tools() -> list:
    """Get all available tools."""
    return [
        AppointmentScheduler(),
        AppointmentFinder(),
        PatientInfoRetriever(),
    ]
