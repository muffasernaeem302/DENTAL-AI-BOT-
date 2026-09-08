"""DentalAI Agents Package"""
from .ai_service import ai_service, AIServiceError, AIService
from .orchestrator import orchestrator, Orchestrator, Intent, TargetAgent
from .base_agent import AgentResponse, BaseAgent
from .reception_agent import reception_agent, ReceptionAgent
from .screening_agent import screening_agent, ScreeningAgent
from .appointment_agent import appointment_agent, AppointmentAgent
from .urgency_agent import urgency_agent, UrgencyAgent
from .summary_agent import summary_agent, SummaryAgent
from .followup_agent import followup_agent, FollowupAgent

# Agent mapping for routing
AGENT_MAP = {
    TargetAgent.RECEPTION: reception_agent,
    TargetAgent.SCREENING: screening_agent,
    TargetAgent.APPOINTMENT: appointment_agent,
    TargetAgent.URGENCY: urgency_agent,
    TargetAgent.SUMMARY: summary_agent,
    TargetAgent.FOLLOWUP: followup_agent,
}

__all__ = [
    "ai_service", "AIServiceError", "AIService",
    "orchestrator", "Orchestrator", "Intent", "TargetAgent",
    "AgentResponse", "BaseAgent",
    "reception_agent", "ReceptionAgent",
    "screening_agent", "ScreeningAgent",
    "appointment_agent", "AppointmentAgent",
    "urgency_agent", "UrgencyAgent",
    "summary_agent", "SummaryAgent",
    "followup_agent", "FollowupAgent",
    "AGENT_MAP",
]
 
