"""Summary Agent"""
from .base_agent import BaseAgent, AgentResponse

class SummaryAgent(BaseAgent):
    def __init__(self):
        super().__init__("Summary Agent")
        self.PROMPT_PATH = "summary.txt"
        self.SCHEMA = {"type": "object", "properties": {"summary_type": {"type": "string"}, "summary": {"type": "string"}, "key_points": {"type": "array"}, "action_items": {"type": "array"}, "flags": {"type": "array"}, "ready_for_dentist_review": {"type": "boolean"}}, "required": ["summary", "key_points"]}
    
    async def process(self, msg: str, ctx: dict = None) -> AgentResponse:
        try:
            from .ai_service import ai_service
            response = await ai_service.complete_structured(prompt=self._build_prompt(msg, ctx), system_prompt=self.prompt, response_schema=self.SCHEMA)
            return AgentResponse(message=response.get("summary", ""), agent=self.name, intent="SUMMARY", data=response)
        except Exception as e:
            return AgentResponse(message="I'm having trouble creating a summary. Please try again.", agent=self.name, intent="ERROR", data={"error": str(e)})

summary_agent = SummaryAgent()
  
