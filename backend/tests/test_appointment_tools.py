"""Tests for Appointment Tool System"""
import pytest
from datetime import date, timedelta
from services import tool_registry, ToolValidator
from services.appointment_tools import TOOL_MAP, APPOINTMENT_TOOLS
from unittest.mock import MagicMock


class TestToolDefinitions:
    def test_all_tools_defined(self):
        assert "check_available_slots" in TOOL_MAP
        assert "create_appointment" in TOOL_MAP
        assert "reschedule_appointment" in TOOL_MAP
        assert "cancel_appointment" in TOOL_MAP
    
    def test_tools_have_descriptions(self):
        for name, tool in TOOL_MAP.items():
            assert tool.description
    
    def test_tools_have_parameters(self):
        for name, tool in TOOL_MAP.items():
            assert len(tool.parameters) > 0
    
    def test_openai_format(self):
        for tool in APPOINTMENT_TOOLS:
            openai = tool.to_openai_format()
            assert "function" in openai
            assert "name" in openai["function"]


class TestToolRegistry:
    def test_get_tool(self):
        tool = tool_registry.get_tool("check_available_slots")
        assert tool is not None
    
    def test_get_tools_for_openai(self):
        tools = tool_registry.get_tools_for_openai()
        assert len(tools) == 7


class TestToolValidator:
    def test_duration_map(self):
        assert ToolValidator.DURATION_MAP["checkup"] == 30
        assert ToolValidator.DURATION_MAP["cleaning"] == 45
    
    def test_validate_date_format(self):
        v = ToolValidator(MagicMock())
        assert v.validate_date_format("2026-09-10") == date(2026, 9, 10)
        assert v.validate_date_format("invalid") is None
    
    def test_validate_time_format(self):
        from datetime import time
        v = ToolValidator(MagicMock())
        assert v.validate_time_format("09:00") == time(9, 0)
        assert v.validate_time_format("invalid") is None
    
    def test_validate_business_hours(self):
        v = ToolValidator(MagicMock())
        assert v.validate_business_hours("09:00") is not None
        assert v.validate_business_hours("17:00") is None
        assert v.validate_business_hours("08:00") is None
    
    def test_validate_future_date(self):
        v = ToolValidator(MagicMock())
        future = (date.today() + timedelta(days=1)).strftime("%Y-%m-%d")
        past = (date.today() - timedelta(days=1)).strftime("%Y-%m-%d")
        assert v.validate_future_date(future) is not None
        assert v.validate_future_date(past) is None
    
    def test_validate_appointment_type(self):
        v = ToolValidator(MagicMock())
        assert v.validate_appointment_type("checkup") == "checkup"
        assert v.validate_appointment_type("invalid") is None


class TestUnauthorizedAccess:
    def test_patient_cannot_book_for_others(self):
        from services import AppointmentToolExecutor
        mock_db = MagicMock()
        executor = AppointmentToolExecutor(mock_db)
        
        result = executor.create_appointment(
            user_id="patient1", user_role="patient",
            patient_id="patient2", dentist_id="dentist1",
            date=(date.today() + timedelta(days=1)).strftime("%Y-%m-%d"),
            start_time="10:00", appointment_type="checkup"
        )
        
        assert result.success is False


class TestMalformedInput:
    def test_invalid_date(self):
        from services import AppointmentToolExecutor
        mock_db = MagicMock()
        executor = AppointmentToolExecutor(mock_db)
        
        result = executor.check_available_slots("u", "patient", "not-a-date")
        assert result.success is False
    
    def test_past_date_rejected(self):
        from services import AppointmentToolExecutor
        mock_db = MagicMock()
        executor = AppointmentToolExecutor(mock_db)
        
        past = (date.today() - timedelta(days=1)).strftime("%Y-%m-%d")
        result = executor.check_available_slots("u", "patient", past)
        assert result.success is False
    
    def test_outside_business_hours(self):
        from services import AppointmentToolExecutor
        mock_db = MagicMock()
        executor = AppointmentToolExecutor(mock_db)
        
        result = executor.create_appointment(
            "u", "patient", "p1", "d1",
            (date.today() + timedelta(days=1)).strftime("%Y-%m-%d"),
            "20:00", "checkup"
        )
        assert result.success is False
    
    def test_invalid_type(self):
        from services import AppointmentToolExecutor
        mock_db = MagicMock()
        executor = AppointmentToolExecutor(mock_db)
        
        result = executor.create_appointment(
            "u", "patient", "p1", "d1",
            (date.today() + timedelta(days=1)).strftime("%Y-%m-%d"),
            "10:00", "magic"
        )
        assert result.success is False


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
 
