"""Alert Service for DentalAI - Internal patient alerts for dentists"""
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional
from enum import Enum


class AlertSeverity(Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class AlertStatus(Enum):
    ACTIVE = "ACTIVE"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    DISMISSED = "DISMISSED"
    RESOLVED = "RESOLVED"


@dataclass
class DentistAlert:
    """Internal alert for dentist notification"""
    id: str
    patient_id: str
    patient_name: str
    severity: AlertSeverity
    status: AlertStatus
    reason_codes: list[str]
    chief_complaint: Optional[str]
    pain_level: Optional[int]
    symptoms: dict
    recommended_action: str
    created_at: str
    acknowledged_at: Optional[str] = None
    acknowledged_by: Optional[str] = None
    notes: Optional[str] = None
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "patient_name": self.patient_name,
            "severity": self.severity.value,
            "status": self.status.value,
            "reason_codes": self.reason_codes,
            "chief_complaint": self.chief_complaint,
            "pain_level": self.pain_level,
            "symptoms": self.symptoms,
            "recommended_action": self.recommended_action,
            "created_at": self.created_at,
            "acknowledged_at": self.acknowledged_at,
            "acknowledged_by": self.acknowledged_by,
            "notes": self.notes
        }


class AlertService:
    """Service for managing dentist alerts"""
    
    def __init__(self):
        self._alerts: dict[str, DentistAlert] = {}
    
    def create_alert(self, patient_id: str, patient_name: str, escalation_level: str,
                    reason_codes: list, intake_data: dict, action: str) -> DentistAlert:
        """Create a new alert from safety evaluation"""
        import uuid
        
        # Map escalation level to severity
        severity_map = {"ESCALATE": AlertSeverity.CRITICAL, "PRIORITY": AlertSeverity.HIGH}
        severity = severity_map.get(escalation_level, AlertSeverity.MEDIUM)
        
        alert = DentistAlert(
            id=str(uuid.uuid4()),
            patient_id=patient_id,
            patient_name=patient_name,
            severity=severity,
            status=AlertStatus.ACTIVE,
            reason_codes=reason_codes,
            chief_complaint=intake_data.get("chief_complaint"),
            pain_level=intake_data.get("pain_level"),
            symptoms={
                "swelling": intake_data.get("swelling"),
                "bleeding": intake_data.get("bleeding"),
                "fever": intake_data.get("fever"),
                "difficulty_chewing": intake_data.get("difficulty_chewing")
            },
            recommended_action=action,
            created_at=datetime.now(timezone.utc).isoformat()
        )
        
        self._alerts[alert.id] = alert
        return alert
    
    def get_active_alerts(self, dentist_id: Optional[str] = None) -> list[DentistAlert]:
        """Get all active alerts, optionally filtered by dentist"""
        return [a for a in self._alerts.values() if a.status == AlertStatus.ACTIVE]
    
    def get_all_alerts(self) -> list[DentistAlert]:
        """Get all alerts"""
        return list(self._alerts.values())
    
    def get_alerts_for_patient(self, patient_id: str) -> list[DentistAlert]:
        """Get all alerts for a specific patient"""
        return [a for a in self._alerts.values() if a.patient_id == patient_id]
    
    def acknowledge_alert(self, alert_id: str, dentist_id: str, notes: Optional[str] = None) -> bool:
        """Mark an alert as acknowledged by dentist"""
        alert = self._alerts.get(alert_id)
        if alert:
            alert.status = AlertStatus.ACKNOWLEDGED
            alert.acknowledged_at = datetime.now(timezone.utc).isoformat()
            alert.acknowledged_by = dentist_id
            if notes:
                alert.notes = notes
            return True
        return False
    
    def dismiss_alert(self, alert_id: str, dentist_id: str, reason: str) -> bool:
        """Dismiss an alert with a reason"""
        alert = self._alerts.get(alert_id)
        if alert:
            alert.status = AlertStatus.DISMISSED
            alert.notes = reason
            return True
        return False
    
    def resolve_alert(self, alert_id: str) -> bool:
        """Mark an alert as resolved"""
        alert = self._alerts.get(alert_id)
        if alert:
            alert.status = AlertStatus.RESOLVED
            return True
        return False
    
    def get_alert_counts(self) -> dict:
        """Get counts by status"""
        counts = {"total": len(self._alerts), "active": 0, "acknowledged": 0, "resolved": 0, "dismissed": 0}
        for alert in self._alerts.values():
            counts[alert.status.value.lower()] += 1
        return counts


alert_service = AlertService()
 
