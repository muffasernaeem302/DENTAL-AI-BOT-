"""Appointment Agent - Handles booking with validated tool calling"""
from .base_agent import BaseAgent, AgentResponse
from services import tool_registry, APPOINTMENT_TOOLS
from database import get_db


class AppointmentAgent(BaseAgent):
    """Appointment management using validated tool calls"""
    
    def __init__(self):
        super().__init__("Appointment Agent")
        self.PROMPT_PATH = "appointment.txt"
    
    def get_available_tools(self) -> list:
        return tool_registry.get_tools_for_openai()
    
    async def process(self, msg: str, ctx: dict = None) -> AgentResponse:
        try:
            user = self._get_user(ctx)
            
            # Handle tool calls from LLM
            if ctx and ctx.get("tool_calls"):
                return await self._execute_tools(ctx["tool_calls"], user)
            
            return await self._simple_intent(msg, user)
            
        except Exception as e:
            return AgentResponse(message="Having trouble with appointments. Please call our clinic.", agent=self.name, intent="ERROR", data={"error": str(e)})
    
    async def _execute_tools(self, tool_calls: list, user: dict) -> AgentResponse:
        results = []
        db = next(get_db())
        
        for call in tool_calls:
            result = tool_registry.execute_tool(call.get("name"), call.get("arguments", {}), user, db)
            results.append({"tool": call.get("name"), "success": result.success, "data": result.data, "error": result.error})
        
        failed = [r for r in results if not r["success"]]
        if failed:
            return AgentResponse(message=f"Could not complete: {failed[0]['error']}", agent=self.name, intent="ERROR", data={"results": results})
        
        data = results[0].get("data", {})
        msg = f"Done: {data.get('message', 'Success')}"
        
        return AgentResponse(message=msg, agent=self.name, intent="APPOINTMENT_SUCCESS", data={"results": results})
    
    async def _simple_intent(self, msg: str, user: dict) -> AgentResponse:
        msg_lower = msg.lower()
        
        if "available" in msg_lower:
            from datetime import date, timedelta
            tomorrow = (date.today() + timedelta(days=1)).strftime("%Y-%m-%d")
            return AgentResponse(message=f"Checking slots for {tomorrow}...", agent=self.name, intent="CHECKING_SLOTS", data={"date": tomorrow})
        
        return AgentResponse(message="I can help book, reschedule, or cancel appointments. What would you like?", agent=self.name, intent="HELP", data={})
    
    def _get_user(self, ctx: dict) -> dict:
        if ctx and ctx.get("patient_context"):
            pc = ctx["patient_context"]
            return {"id": pc.get("id", "unknown"), "role": pc.get("role", "patient"), "name": pc.get("name")}
        return {"id": "unknown", "role": "patient"}


appointment_agent = AppointmentAgent()
 
