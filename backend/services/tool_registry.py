"""Tool Registry - Maps tool names to executor methods and OpenAI format"""
from typing import Callable, Optional
from .appointment_tools import APPOINTMENT_TOOLS, TOOL_MAP
from .tool_executor import AppointmentToolExecutor, ToolResult


class ToolRegistry:
    """Registry mapping tool names to executor methods"""
    
    def __init__(self):
        self._registry: dict[str, Callable] = {}
        self._setup_tools()
    
    def _setup_tools(self):
        """Register all appointment tools"""
        # Tool method mapping
        self._registry = {
            "check_available_slots": self._exec_check_slots,
            "get_appointment": self._exec_get_appointment,
            "create_appointment": self._exec_create_appointment,
            "reschedule_appointment": self._exec_reschedule,
            "cancel_appointment": self._exec_cancel,
            "get_dentist_schedule": self._exec_dentist_schedule,
            "get_patient_appointments": self._exec_patient_appointments,
        }
    
    def _exec_check_slots(self, executor: AppointmentToolExecutor, args: dict, user: dict) -> ToolResult:
        return executor.check_available_slots(
            user_id=user.get("id", ""), user_role=user.get("role", "patient"),
            date=args.get("date"), dentist_id=args.get("dentist_id"),
            appointment_type=args.get("appointment_type")
        )
    
    def _exec_get_appointment(self, executor: AppointmentToolExecutor, args: dict, user: dict) -> ToolResult:
        return executor.get_appointment(
            user_id=user.get("id", ""), user_role=user.get("role", "patient"),
            appointment_id=args.get("appointment_id")
        )
    
    def _exec_create_appointment(self, executor: AppointmentToolExecutor, args: dict, user: dict) -> ToolResult:
        return executor.create_appointment(
            user_id=user.get("id", ""), user_role=user.get("role", "patient"),
            patient_id=args.get("patient_id"), dentist_id=args.get("dentist_id"),
            date=args.get("date"), start_time=args.get("start_time"),
            appointment_type=args.get("appointment_type"), notes=args.get("notes")
        )
    
    def _exec_reschedule(self, executor: AppointmentToolExecutor, args: dict, user: dict) -> ToolResult:
        return executor.reschedule_appointment(
            user_id=user.get("id", ""), user_role=user.get("role", "patient"),
            appointment_id=args.get("appointment_id"),
            new_date=args.get("new_date"), new_start_time=args.get("new_start_time")
        )
    
    def _exec_cancel(self, executor: AppointmentToolExecutor, args: dict, user: dict) -> ToolResult:
        return executor.cancel_appointment(
            user_id=user.get("id", ""), user_role=user.get("role", "patient"),
            appointment_id=args.get("appointment_id"), reason=args.get("reason")
        )
    
    def _exec_dentist_schedule(self, executor: AppointmentToolExecutor, args: dict, user: dict) -> ToolResult:
        return executor.get_dentist_schedule(
            user_id=user.get("id", ""), user_role=user.get("role", "patient"),
            dentist_id=args.get("dentist_id"), date=args.get("date")
        )
    
    def _exec_patient_appointments(self, executor: AppointmentToolExecutor, args: dict, user: dict) -> ToolResult:
        return executor.get_patient_appointments(
            user_id=user.get("id", ""), user_role=user.get("role", "patient"),
            patient_id=args.get("patient_id"), status=args.get("status")
        )
    
    def get_tool(self, name: str) -> Optional[Callable]:
        """Get registered tool by name"""
        return self._registry.get(name)
    
    def execute_tool(self, tool_name: str, args: dict, user: dict, db) -> ToolResult:
        """Execute a tool with validation"""
        tool = self.get_tool(tool_name)
        if not tool:
            return ToolResult(success=False, error=f"Unknown tool: {tool_name}")
        
        executor = AppointmentToolExecutor(db)
        return tool(executor, args, user)
    
    def get_tools_for_openai(self) -> list[dict]:
        """Get all tools in OpenAI function-calling format"""
        return [tool.to_openai_format() for tool in APPOINTMENT_TOOLS]
    
    def get_tool_definition(self, name: str) -> Optional[dict]:
        """Get specific tool definition"""
        tool = TOOL_MAP.get(name)
        return tool.to_openai_format() if tool else None


# Singleton instance
tool_registry = ToolRegistry()
  
