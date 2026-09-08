"""Reception Agent"""
from .base_agent import BaseAgent, AgentResponse

class ReceptionAgent(BaseAgent):
    def __init__(self):
        super().__init__("Reception Agent")
        self.PROMPT_PATH = "reception.txt"
        self.SCHEMA = {"type": "object", "properties": {"message": {"type": "string"}, "follow_up_needed": {"type": "boolean"}, "suggested_action": {"type": ["string", "null"]}}, "required": ["message"]}
    
    async def process(self, msg: str, ctx: dict = None) -> AgentResponse:
        try:
            from .ai_service import ai_service
            response = await ai_service.complete_structured(prompt=self._build_prompt(msg, ctx), system_prompt=self.prompt, response_schema=self.SCHEMA)
            return AgentResponse(message=response.get("message", ""), agent=self.name, intent="GENERAL_CLINIC_QUESTION", data=response)
        except Exception as e:
            return AgentResponse(message="I'm having trouble. Please contact our clinic.", agent=self.name, intent="ERROR", data={"error": str(e)})

reception_agent = ReceptionAgent()
  
