"""Followup Agent"""
from .base_agent import BaseAgent, AgentResponse

class FollowupAgent(BaseAgent):
    def __init__(self):
        super().__init__("Followup Agent")
        self.PROMPT_PATH = "followup.txt"
        self.SCHEMA = {"type": "object", "properties": {"message": {"type": "string"}, "topic": {"type": "string"}, "self_care_instructions": {"type": "array"}, "warning_signs": {"type": "array"}, "when_to_call": {"type": "string"}, "professional_required": {"type": "boolean"}}, "required": ["message"]}
    
    async def process(self, msg: str, ctx: dict = None) -> AgentResponse:
        try:
            from .ai_service import ai_service
            response = await ai_service.complete_structured(prompt=self._build_prompt(msg, ctx), system_prompt=self.prompt, response_schema=self.SCHEMA)
            return AgentResponse(message=response.get("message", ""), agent=self.name, intent="FOLLOW_UP", data=response)
        except Exception as e:
            return AgentResponse(message="I'm having trouble with your follow-up question. Please contact our clinic.", agent=self.name, intent="ERROR", data={"error": str(e)})

followup_agent = FollowupAgent()
  
