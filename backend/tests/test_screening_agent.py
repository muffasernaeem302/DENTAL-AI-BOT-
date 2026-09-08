"""Tests for the Screening Agent"""
import pytest
from agents import screening_agent

class TestScreeningAgent:
    @pytest.mark.asyncio
    async def test_agent_exists(self):
        assert screening_agent is not None
        assert screening_agent.name == "Screening Agent"
    
    @pytest.mark.asyncio
    async def test_emergency_escalation(self):
        response = await screening_agent.process("I have severe swelling and cannot open my mouth")
        assert response.intent == "URGENT_ESCALATION"
        assert response.data.get("escalate_to_urgency") == True
    
    @pytest.mark.asyncio
    async def test_regular_intake(self):
        response = await screening_agent.process("My tooth hurts")
        assert response.agent == "Screening Agent"
        assert response.intent == "PRE_VISIT_INTAKE"
    
    def test_schema_has_intake_data(self):
        schema = screening_agent.SCHEMA
        assert "intake_data" in schema["properties"]
        intake_props = schema["properties"]["intake_data"]["properties"]
        assert "chief_complaint" in intake_props
        assert "pain_level" in intake_props

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
 
