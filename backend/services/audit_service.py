"""Audit Service for DentalAI - Event logging and tracking"""
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from typing import Optional
from enum import Enum
import json


class AuditEventType(Enum):
    SAFETY_EVALUATION = "SAFETY_EVALUATION"
    URGENCY_ESCALATION = "URGENCY_ESCALATION"
    ALERT_CREATED = "ALERT_CREATED"
    ALERT_DISMISSED = "ALERT_DISMISSED"
    INTAKE_COMPLETED = "INTAKE_COMPLETED"
    APPOINTMENT_BOOKED = "APPOINTMENT_BOOKED"


@dataclass
class AuditEntry:
    """Immutable audit log entry"""
    event_type: str
    timestamp: str
    patient_id: Optional[str]
    escalation_level: Optional[str]
    reason_codes: list
    details: dict
    
    def to_dict(self) -> dict:
        return asdict(self)


class AuditService:
    """Service for recording auditable events"""
    
    def __init__(self):
        self._log: list[AuditEntry] = []
    
    def log_safety_evaluation(self, patient_id: str, level: str, reason_codes: list, intake_data: dict) -> AuditEntry:
        """Log a safety evaluation event"""
        entry = AuditEntry(
            event_type=AuditEventType.SAFETY_EVALUATION.value,
            timestamp=datetime.now(timezone.utc).isoformat(),
            patient_id=patient_id,
            escalation_level=level,
            reason_codes=reason_codes,
            details={"intake_summary": self._summarize_intake(intake_data)}
        )
        self._log.append(entry)
        return entry
    
    def log_escalation(self, patient_id: str, level: str, reason_codes: list, action_taken: str) -> AuditEntry:
        """Log an escalation event"""
        entry = AuditEntry(
            event_type=AuditEventType.URGENCY_ESCALATION.value,
            timestamp=datetime.now(timezone.utc).isoformat(),
            patient_id=patient_id,
            escalation_level=level,
            reason_codes=reason_codes,
            details={"action_taken": action_taken}
        )
        self._log.append(entry)
        return entry
    
    def log_alert_created(self, patient_id: str, alert_id: str, level: str, reason_codes: list) -> AuditEntry:
        """Log alert creation"""
        entry = AuditEntry(
            event_type=AuditEventType.ALERT_CREATED.value,
            timestamp=datetime.now(timezone.utc).isoformat(),
            patient_id=patient_id,
            escalation_level=level,
            reason_codes=reason_codes,
            details={"alert_id": alert_id}
        )
        self._log.append(entry)
        return entry
    
    def log_alert_dismissed(self, alert_id: str, dismissed_by: str) -> AuditEntry:
        """Log alert dismissal"""
        entry = AuditEntry(
            event_type=AuditEventType.ALERT_DISMISSED.value,
            timestamp=datetime.now(timezone.utc).isoformat(),
            patient_id=None,
            escalation_level=None,
            reason_codes=[],
            details={"alert_id": alert_id, "dismissed_by": dismissed_by}
        )
        self._log.append(entry)
        return entry
    
    def get_logs(self, patient_id: Optional[str] = None, event_type: Optional[str] = None) -> list[dict]:
        """Retrieve audit logs with optional filters"""
        results = self._log
        if patient_id:
            results = [e for e in results if e.patient_id == patient_id]
        if event_type:
            results = [e for e in results if e.event_type == event_type]
        return [e.to_dict() for e in reversed(results)]
    
    def export_logs(self) -> str:
        """Export all logs as JSON"""
        return json.dumps([e.to_dict() for e in self._log], indent=2)
    
    def _summarize_intake(self, data: dict) -> dict:
        """Create minimal summary without sensitive details"""
        return {
            "chief_complaint": data.get("chief_complaint", "")[:50] if data.get("chief_complaint") else None,
            "pain_level": data.get("pain_level"),
            "has_symptoms": any([data.get("swelling"), data.get("bleeding"), data.get("fever")])
        }


audit_service = AuditService()
  
