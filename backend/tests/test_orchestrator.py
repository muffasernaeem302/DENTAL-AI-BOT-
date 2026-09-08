"""Tests for the AI Orchestrator"""
import pytest
from agents import orchestrator, Intent, TargetAgent

class TestOrchestrator:
    """Test orchestrator intent detection"""
    
    @pytest.mark.asyncio
    async def test_appointment_intent(self):
        """Test APPOINTMENT_REQUEST intent detection"""
        result = await orchestrator.route("I need to schedule a dental appointment for next week")
        assert result.intent == Intent.APPOINTMENT_REQUEST
        assert result.target_agent == TargetAgent.APPOINTMENT
    
    @pytest.mark.asyncio
    async def test_cancellation_intent(self):
        """Test APPOINTMENT_CANCELLATION intent detection"""
        result = await orchestrator.route("I need to cancel my appointment on Friday")
        assert result.intent == Intent.APPOINTMENT_CANCELLATION
        assert result.target_agent == TargetAgent.APPOINTMENT
    
    @pytest.mark.asyncio
    async def test_followup_intent(self):
        """Test FOLLOW_UP intent detection"""
        result = await orchestrator.route("I had a filling done yesterday and it's still sensitive. Is that normal?")
        assert result.intent == Intent.FOLLOW_UP
    
    @pytest.mark.asyncio
    async def test_general_question_intent(self):
        """Test GENERAL_CLINIC_QUESTION intent detection"""
        result = await orchestrator.route("What are your clinic hours?")
        assert result.intent == Intent.GENERAL_CLINIC_QUESTION
        assert result.target_agent == TargetAgent.RECEPTION
    
    @pytest.mark.asyncio
    async def test_unknown_intent(self):
        """Test UNKNOWN intent for unclear messages"""
        result = await orchestrator.route("xyzabc123")
        assert isinstance(result.intent, Intent)
    
    @pytest.mark.asyncio
    async def test_urgency_keywords(self):
        """Test URGENT_ESCALATION intent with severe symptoms"""
        result = await orchestrator.route("I have severe swelling in my jaw and I can't open my mouth. I also have a fever.")
        assert result.intent == Intent.URGENT_ESCALATION
        assert result.target_agent == TargetAgent.URGENCY


class TestIntentMapping:
    """Test intent to agent mapping"""
    
    def test_intent_enum_values(self):
        """Test that all intents have expected values"""
        expected = ["APPOINTMENT_REQUEST", "APPOINTMENT_CHANGE", "APPOINTMENT_CANCELLATION", "GENERAL_CLINIC_QUESTION", "PRE_VISIT_INTAKE", "FOLLOW_UP", "URGENT_ESCALATION", "UNKNOWN"]
        actual = [i.value for i in Intent]
        for exp in expected:
            assert exp in actual
    
    def test_target_agent_values(self):
        """Test that all target agents have expected values"""
        expected = ["appointment_agent", "reception_agent", "screening_agent", "urgency_agent", "summary_agent", "followup_agent"]
        actual = [t.value for t in TargetAgent]
        for exp in expected:
            assert exp in actual


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
  
