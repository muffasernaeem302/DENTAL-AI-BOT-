"""Tests for Safety Rules"""
import pytest
from services import safety_rules, EscalationLevel, SafetyInput


class TestRoutine:
    def test_no_symptoms(self):
        result = safety_rules.evaluate_from_dict({"chief_complaint": "schedule appointment"})
        assert result.level == EscalationLevel.ROUTINE
    
    def test_checkup_question(self):
        result = safety_rules.evaluate_from_dict({"chief_complaint": "question about cleaning"})
        assert result.level == EscalationLevel.ROUTINE


class TestPriority:
    def test_moderate_pain_level_6(self):
        result = safety_rules.evaluate_from_dict({"pain_level": 6})
        assert result.level == EscalationLevel.PRIORITY
    
    def test_moderate_pain_text(self):
        result = safety_rules.evaluate_from_dict({"chief_complaint": "moderate pain"})
        assert result.level == EscalationLevel.PRIORITY
    
    def test_very_sensitive(self):
        result = safety_rules.evaluate_from_dict({"chief_complaint": "very sensitive to cold"})
        assert result.level == EscalationLevel.PRIORITY
    
    def test_any_sensitivity(self):
        result = safety_rules.evaluate_from_dict({"chief_complaint": "tooth is sensitive"})
        assert result.level == EscalationLevel.PRIORITY
    
    def test_bleeding_boolean(self):
        result = safety_rules.evaluate_from_dict({"bleeding": True})
        assert result.level == EscalationLevel.PRIORITY


class TestEscalate:
    def test_severe_pain_text(self):
        result = safety_rules.evaluate_from_dict({"chief_complaint": "I have severe pain"})
        assert result.level == EscalationLevel.ESCALATE
    
    def test_pain_level_8(self):
        result = safety_rules.evaluate_from_dict({"pain_level": 8})
        assert result.level == EscalationLevel.ESCALATE
    
    def test_pain_level_10(self):
        result = safety_rules.evaluate_from_dict({"pain_level": 10})
        assert result.level == EscalationLevel.ESCALATE
    
    def test_cant_breathe(self):
        result = safety_rules.evaluate_from_dict({"chief_complaint": "I cant breathe"})
        assert result.level == EscalationLevel.ESCALATE
    
    def test_bleeding_wont_stop(self):
        result = safety_rules.evaluate_from_dict({"chief_complaint": "bleeding wont stop"})
        assert result.level == EscalationLevel.ESCALATE
    
    def test_fever_with_pain(self):
        result = safety_rules.evaluate_from_dict({"pain_level": 5, "fever": True})
        assert result.level == EscalationLevel.ESCALATE


class TestEdgeCases:
    def test_empty_input(self):
        result = safety_rules.evaluate(SafetyInput())
        assert result.level == EscalationLevel.ROUTINE
    
    def test_none_values(self):
        result = safety_rules.evaluate(SafetyInput(chief_complaint=None, pain_level=None))
        assert result.level == EscalationLevel.ROUTINE
    
    def test_pain_level_above_10(self):
        result = safety_rules.evaluate_from_dict({"pain_level": 15})
        assert result.level == EscalationLevel.ESCALATE
    
    def test_conflicting_mild_num_severe_text(self):
        result = safety_rules.evaluate_from_dict({"pain_level": 2, "chief_complaint": "I have severe pain"})
        assert result.level == EscalationLevel.ESCALATE


class TestAuditAndAlerts:
    def test_audit_logging(self):
        from services import audit_service
        result = safety_rules.evaluate_from_dict({"chief_complaint": "severe pain"})
        entry = audit_service.log_safety_evaluation("p1", result.level.value, result.reason_codes, {})
        assert entry.patient_id == "p1"
    
    def test_alert_creation(self):
        from services import alert_service
        result = safety_rules.evaluate_from_dict({"chief_complaint": "severe pain", "pain_level": 9})
        alert = alert_service.create_alert("p1", "Test Patient", result.level.value, result.reason_codes, {}, "Seek care")
        assert alert.severity.value == "CRITICAL"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
 
