"""Screening Agent - Pre-visit patient intake collection"""
from .base_agent import BaseAgent, AgentResponse
from .orchestrator import TargetAgent
from .urgency_agent import urgency_agent

class ScreeningAgent(BaseAgent):
    """Collects structured patient intake information before dental visits."""
    
    def __init__(self):
        super().__init__("Screening Agent")
        self.PROMPT_PATH = "screening.txt"
        self.SCHEMA = {
            "type": "object",
            "properties": {
                "message": {"type": "string"},
                "intake_data": {
                    "type": "object",
                    "properties": {
                        "chief_complaint": {"type": ["string", "null"]},
                        "location": {"type": ["string", "null"]},
                        "duration": {"type": ["string", "null"]},
                        "pain_level": {"type": ["number", "null"], "minimum": 0, "maximum": 10},
                        "swelling": {"type": ["boolean", "null"]},
                        "bleeding": {"type": ["boolean", "null"]},
                        "sensitivity": {"type": ["boolean", "null"]},
                        "difficulty_chewing": {"type": ["boolean", "null"]},
                        "fever": {"type": ["boolean", "null"]},
                        "recent_procedure": {"type": ["string", "null"]},
                        "notes": {"type": ["string", "null"]}
                    }
                },
                "collected_fields": {
                    "type": "array",
                    "items": {"type": "string"}
                },
                "next_question": {"type": "string"},
                "flags_for_dentist": {"type": "array", "items": {"type": "string"}},
                "escalate_to_urgency": {"type": "boolean"},
                "is_complete": {"type": "boolean"}
            },
            "required": ["message", "intake_data", "collected_fields"]
        }
    
    async def process(self, msg: str, ctx: dict = None) -> AgentResponse:
        try:
            from .ai_service import ai_service
            
            # Check for emergency indicators first
            emergency_keywords = ['severe pain', 'swelling', 'cant open', 'cannot open', 
                                 'bleeding that wont stop', 'fever', 'emergency',
                                 'unbearable', 'cant breathe', 'difficulty breathing']
            msg_lower = msg.lower()
            
            if any(kw in msg_lower for kw in emergency_keywords):
                return AgentResponse(
                    message="Based on what you've described, this sounds like it may need immediate attention. Let me connect you with our urgency agent.",
                    agent=self.name,
                    intent="URGENT_ESCALATION",
                    data={"escalate_to_urgency": True}
                )
            
            # Build prompt with context
            prompt = self._build_screening_prompt(msg, ctx)
            
            response = await ai_service.complete_structured(
                prompt=prompt,
                system_prompt=self.prompt,
                response_schema=self.SCHEMA
            )
            
            # Return structured response
            return AgentResponse(
                message=response.get("message", ""),
                agent=self.name,
                intent="PRE_VISIT_INTAKE",
                data={
                    "intake_data": response.get("intake_data", {}),
                    "collected_fields": response.get("collected_fields", []),
                    "next_question": response.get("next_question", ""),
                    "flags_for_dentist": response.get("flags_for_dentist", []),
                    "is_complete": response.get("is_complete", False)
                }
            )
        except Exception as e:
            return AgentResponse(
                message="I'm having trouble collecting your information. Please try again or contact our clinic directly.",
                agent=self.name,
                intent="ERROR",
                data={"error": str(e)}
            )
    
    def _build_screening_prompt(self, msg: str, ctx: dict = None) -> str:
        """Build a prompt that guides the agent to ask one question at a time."""
        
        prompt = f"""
## PATIENT MESSAGE:
"{msg}"

## YOUR TASK:
You are collecting pre-visit information from a dental patient. Ask ONE follow-up question at a time unless all critical information is already collected.

## COLLECTION PRIORITY:
1. Chief complaint (what brings them in)
2. Duration of symptoms
3. Pain level (0-10 scale)
4. Location (which tooth/area if applicable)
5. Additional symptoms (swelling, bleeding, sensitivity, difficulty chewing)
6. Recent procedures or dental work
7. Patient notes or concerns

## RULES:
- NEVER diagnose - say "The dentist will evaluate this"
- If emergency keywords appear (severe, swelling, cant open mouth, fever), set escalate_to_urgency: true
- Use null for uncollected information
- collected_fields should list which fields have been filled in
- Ask only the NEXT most useful question - don't collect everything at once
- is_complete should only be true when essential info is gathered

## RESPONSE FORMAT:
Return JSON with:
- message: Your response to the patient
- intake_data: All collected fields (use null for uncollected)
- collected_fields: List of field names that have values
- next_question: What you'll ask next (empty if is_complete)
- flags_for_dentist: Any concerns to flag (e.g., "allergy mentioned", "possible infection")
- escalate_to_urgency: true/false
- is_complete: true when ready for appointment
"""
        
        # Add previous intake data from context if available
        if ctx and ctx.get("intake_data"):
            prompt += f"\n\n## PREVIOUSLY COLLECTED:\n{ctx['intake_data']}"
        
        return prompt

screening_agent = ScreeningAgent()
 
