"""Urgency Agent - Safety-focused emergency evaluation using deterministic rules"""
from .base_agent import BaseAgent, AgentResponse
from services import safety_rules, alert_service, audit_service, EscalationLevel


class UrgencyAgent(BaseAgent):
    """Safety-focused agent - does NOT diagnose, evaluates with deterministic rules."""
    
    def __init__(self):
        super().__init__("Urgency Agent")
        self.PROMPT_PATH = "urgency.txt"
    
    async def process(self, msg: str, ctx: dict = None) -> AgentResponse:
        try:
            # Get intake data
            intake = {}
            if ctx:
                intake = ctx.get("intake_data", {}) or ctx.get("patient_context", {})
            intake["raw_message"] = msg
            
            # DETERMINISTIC evaluation - cannot be bypassed by LLM
            result = safety_rules.evaluate_from_dict(intake)
            
            # Audit
            audit_service.log_safety_evaluation(
                patient_id=ctx.get("patient_context", {}).get("id") if ctx else None,
                level=result.level.value, reason_codes=result.reason_codes, intake_data=intake
            )
            
            if result.level == EscalationLevel.ESCALATE:
                return await self._escalate(msg, result, intake, ctx)
            elif result.level == EscalationLevel.PRIORITY:
                return await self._priority(result)
            else:
                return await self._routine(result)
                
        except Exception as e:
            return AgentResponse(message="Please contact our office or seek care to be safe.", agent=self.name,
                               intent="URGENT_ESCALATION", data={"error": str(e), "safety_fallback": True})
    
    async def _escalate(self, msg: str, result, intake: dict, ctx: dict) -> AgentResponse:
        name = ctx.get("patient_context", {}).get("name", "Patient") if ctx else "Patient"
        alert = alert_service.create_alert(
            patient_id=ctx.get("patient_context", {}).get("id") if ctx else None,
            patient_name=name, escalation_level=result.level.value, reason_codes=result.reason_codes,
            intake_data=intake, action=result.recommended_action
        )
        audit_service.log_alert_created(alert.patient_id, alert.id, result.level.value, result.reason_codes)
        
        # Build calm message
        if "BREATHING" in str(result.reason_codes):
            msg_text = "Please seek immediate attention. If you're having difficulty breathing, contact 911 or go to emergency room."
        elif "SEVERE_PAIN" in result.reason_codes:
            msg_text = "Your symptoms suggest this needs prompt attention today. Contact our emergency line or visit urgent care."
        else:
            msg_text = result.patient_message
        
        tips = ["Apply cold compress (15 min on/off)", "Avoid hot/cold/sweet foods", "Sleep with head elevated"]
        
        return AgentResponse(message=msg_text, agent=self.name, intent="URGENT_ESCALATION", data={
            "safety_result": result.to_dict(), "alert_id": alert.id, "self_care_tips": tips,
            "warning_signs": ["Difficulty breathing", "Swelling spreading to face", "High fever", "Bleeding won't stop"],
            "escalation_required": True
        })
    
    async def _priority(self, result) -> AgentResponse:
        return AgentResponse(message=f"Based on your symptoms, schedule within 24-48 hours. {result.patient_message}",
                           agent=self.name, intent="PRIORITY_ESCALATION",
                           data={"safety_result": result.to_dict(), "escalation_required": False})
    
    async def _routine(self, result) -> AgentResponse:
        return AgentResponse(message=result.patient_message, agent=self.name, intent="ROUTINE_INTAKE",
                           data={"safety_result": result.to_dict(), "escalation_required": False})


urgency_agent = UrgencyAgent()
 
