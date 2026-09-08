"""DentalAI Orchestrator Agent"""
import os
import re
from enum import Enum
from dataclasses import dataclass
from .ai_service import ai_service, AIServiceError

class Intent(Enum):
    APPOINTMENT_REQUEST = "APPOINTMENT_REQUEST"
    APPOINTMENT_CHANGE = "APPOINTMENT_CHANGE"
    APPOINTMENT_CANCELLATION = "APPOINTMENT_CANCELLATION"
    GENERAL_CLINIC_QUESTION = "GENERAL_CLINIC_QUESTION"
    PRE_VISIT_INTAKE = "PRE_VISIT_INTAKE"
    FOLLOW_UP = "FOLLOW_UP"
    URGENT_ESCALATION = "URGENT_ESCALATION"
    UNKNOWN = "UNKNOWN"

class TargetAgent(Enum):
    APPOINTMENT = "appointment_agent"
    RECEPTION = "reception_agent"
    SCREENING = "screening_agent"
    URGENCY = "urgency_agent"
    SUMMARY = "summary_agent"
    FOLLOWUP = "followup_agent"

@dataclass
class OrchestratorOutput:
    intent: Intent
    target_agent: any
    reason: str
    urgency_level: str
    confidence: str

class Orchestrator:
    PROMPT_PATH = os.path.join(os.path.dirname(__file__), "prompts", "orchestrator.txt")
    SCHEMA = {"type": "object", "properties": {"intent": {"type": "string"}, "target_agent": {"type": ["string", "null"]}, "reason": {"type": "string"}, "urgency_level": {"type": "string"}, "confidence": {"type": "string"}}, "required": ["intent"]}
    
    # Keyword patterns for fallback routing
    URGENT_PATTERNS = [
        r'(severe|extreme|unbearable|excruciating).*(pain|ache|swelling)',
        r'(swelling|fever|bleeding|cannot|can\'t)',
        r'(emergency|urgent|right now|immediately)',
        r'(broken|cracked|fractured).*(tooth|teeth)',
    ]
    
    APPOINTMENT_PATTERNS = [
        r'(schedule|book|make|schedule|get).*(appointment|time|date)',
        r'(appointment).*(next week|tomorrow|today)',
        r'(available|open|free).*(time|date|slot|appointment)',
    ]
    
    CANCEL_PATTERNS = [
        r'cancel|cancellation',
        r'reschedule',
        r'(can\'t come|cannot come|cant come|won\'t be)',
    ]
    
    FOLLOWUP_PATTERNS = [
        r'(after|following|post).(procedure|treatment|surgery|extraction|filling)',
        r'(still|continuing|getting worse).*(pain|sensitive|sore)',
        r'(had|did).*(last week|yesterday)',
    ]
    
    RECEPTION_PATTERNS = [
        r'hours|open|closed|when|where|location|address|phone',
        r'cost|price|payment|insurance|coverage',
        r'services|offer|what do you',
    ]
    
    def __init__(self):
        try:
            with open(self.PROMPT_PATH, "r") as f:
                self.prompt = f.read()
        except FileNotFoundError:
            self.prompt = "Route dental clinic messages."
    
    def _keyword_route(self, msg: str) -> OrchestratorOutput | None:
        """Fallback keyword-based routing"""
        msg_lower = msg.lower()
        
        for pattern in self.URGENT_PATTERNS:
            if re.search(pattern, msg_lower):
                return OrchestratorOutput(intent=Intent.URGENT_ESCALATION, target_agent=TargetAgent.URGENCY, reason="Urgent symptom keywords", urgency_level="high", confidence="high")
        
        for pattern in self.CANCEL_PATTERNS:
            if re.search(pattern, msg_lower):
                return OrchestratorOutput(intent=Intent.APPOINTMENT_CANCELLATION, target_agent=TargetAgent.APPOINTMENT, reason="Cancellation keywords", urgency_level="low", confidence="high")
        
        for pattern in self.APPOINTMENT_PATTERNS:
            if re.search(pattern, msg_lower):
                return OrchestratorOutput(intent=Intent.APPOINTMENT_REQUEST, target_agent=TargetAgent.APPOINTMENT, reason="Appointment keywords", urgency_level="medium", confidence="high")
        
        for pattern in self.FOLLOWUP_PATTERNS:
            if re.search(pattern, msg_lower):
                return OrchestratorOutput(intent=Intent.FOLLOW_UP, target_agent=TargetAgent.FOLLOWUP, reason="Follow-up keywords", urgency_level="low", confidence="high")
        
        for pattern in self.RECEPTION_PATTERNS:
            if re.search(pattern, msg_lower):
                return OrchestratorOutput(intent=Intent.GENERAL_CLINIC_QUESTION, target_agent=TargetAgent.RECEPTION, reason="Clinic info keywords", urgency_level="low", confidence="medium")
        
        return None
    
    async def route(self, msg: str, history: list = None, ctx: dict = None) -> OrchestratorOutput:
        try:
            response = await ai_service.complete_structured(prompt=f"Message: {msg}", system_prompt=self.prompt, response_schema=self.SCHEMA)
            parsed = self._parse_response(response)
            if parsed.intent == Intent.UNKNOWN or not parsed.target_agent:
                kw = self._keyword_route(msg)
                if kw: return kw
            return parsed
        except:
            kw = self._keyword_route(msg)
            if kw: return kw
            return OrchestratorOutput(intent=Intent.UNKNOWN, target_agent=None, reason="Route failed", urgency_level="low", confidence="low")
    
    def _parse_response(self, resp: dict) -> OrchestratorOutput:
        try:
            intent = Intent.UNKNOWN
            for i in Intent:
                if i.value == resp.get("intent"): intent = i; break
            target = None
            target_str = resp.get("target_agent")
            if target_str:
                for t in TargetAgent:
                    if t.value == target_str: target = t; break
            return OrchestratorOutput(intent=intent, target_agent=target, reason=resp.get("reason", ""), urgency_level=resp.get("urgency_level", "low"), confidence=resp.get("confidence", "low"))
        except:
            return OrchestratorOutput(intent=Intent.UNKNOWN, target_agent=None, reason="Parse error", urgency_level="low", confidence="low")

orchestrator = Orchestrator()
 
