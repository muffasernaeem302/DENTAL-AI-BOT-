"""
Patient Assistant Agent - Handles patient inquiries and appointment assistance.
"""
from typing import Dict, Any, List
from .base import BaseAgent, AgentMessage
from core.config import settings


class PatientAssistantAgent(BaseAgent):
    """
    AI agent that assists patients with:
    - Answering general dental questions
    - Providing appointment information
    - Offering pre-visit guidance
    - Collecting patient information
    
    IMPORTANT: This agent does NOT diagnose conditions or provide
    medical treatment recommendations.
    """
    
    def __init__(self):
        super().__init__(
            name="Patient Assistant",
            description="Assists patients with scheduling, information, and general inquiries"
        )
        self.system_prompt = """You are a helpful dental clinic assistant named DentalAI. 
Your role is to help patients with:
- Scheduling and managing appointments
- Answering general questions about dental care
- Providing information about procedures and services
- Helping patients prepare for their visits

IMPORTANT LIMITATIONS:
- You CANNOT diagnose medical conditions
- You CANNOT prescribe treatments
- You CANNOT replace consultation with a qualified dentist
- Always recommend patients consult with their dentist for specific medical advice

Be friendly, helpful, and professional. Use simple language and avoid medical jargon when possible.
If a question is beyond your scope, politely redirect to consulting a dentist."""
    
    async def process(self, message: AgentMessage) -> AgentMessage:
        """
        Process patient message and generate response.
        
        In production, this would:
        1. Build conversation context
        2. Call LLM API (OpenAI, Anthropic, etc.)
        3. Apply safety/alignment checks
        4. Return response
        """
        # Mock response for MVP
        response_content = self._generate_response(message.content)
        
        return AgentMessage(
            role="assistant",
            content=response_content,
            metadata={"agent": self.name}
        )
    
    def _generate_response(self, user_message: str) -> str:
        """
        Generate a response to the user's message.
        
        In production, this would call an LLM API.
        For MVP, we return contextual mock responses.
        """
        user_lower = user_message.lower()
        
        if any(word in user_lower for word in ['appointment', 'schedule', 'book']):
            return "I'd be happy to help you with scheduling! You can view available appointments on your dashboard or let me know your preferred date and time. Our clinic is open Monday-Friday, 9AM-5PM."
        
        if any(word in user_lower for word in ['tooth', 'teeth', 'pain', 'ache']):
            return "I'm not able to diagnose dental issues, but if you're experiencing tooth pain, I recommend scheduling an appointment with Dr. Chen. In the meantime, you can rinse with warm salt water and avoid very hot or cold foods."
        
        if any(word in user_lower for word in ['brush', 'floss', 'care', 'hygiene']):
            return "Great question about dental care! The American Dental Association recommends brushing twice daily for two minutes, flossing daily, and regular check-ups every 6 months."
        
        if any(word in user_lower for word in ['cost', 'price', 'insurance', 'pay']):
            return "For specific pricing and insurance information, please contact our front desk or check your insurance details in your profile. We're happy to help verify your coverage!"
        
        if any(word in user_lower for word in ['hours', 'location', 'address', 'where']):
            return "Our clinic is located at 123 Dental Way. We're open Monday through Friday, 9AM to 5PM, and Saturday 9AM to 1PM by appointment."
        
        return "Thank you for your message! I'm here to help with appointment scheduling, general dental questions, and information about our services. What can I assist you with today?"
