"""Dentist Alerts API endpoints"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from services import alert_service, AuditService
from .auth import get_current_user
from models import User

router = APIRouter()


class AlertAcknowledge(BaseModel):
    alert_id: str
    notes: Optional[str] = None


class AlertDismiss(BaseModel):
    alert_id: str
    reason: str


@router.get("/")
async def get_alerts(user: User = Depends(get_current_user)):
    """Get all active alerts for dentist"""
    if user.role != "dentist":
        raise HTTPException(status_code=403, detail="Only dentists can view alerts")
    alerts = alert_service.get_active_alerts()
    return {"alerts": [a.to_dict() for a in alerts], "counts": alert_service.get_alert_counts()}


@router.get("/all")
async def get_all_alerts(user: User = Depends(get_current_user)):
    """Get all alerts including resolved/dismissed"""
    if user.role != "dentist":
        raise HTTPException(status_code=403, detail="Only dentists can view alerts")
    alerts = alert_service.get_all_alerts()
    return {"alerts": [a.to_dict() for a in alerts], "counts": alert_service.get_alert_counts()}


@router.post("/acknowledge")
async def acknowledge_alert(data: AlertAcknowledge, user: User = Depends(get_current_user)):
    """Acknowledge an alert"""
    if user.role != "dentist":
        raise HTTPException(status_code=403, detail="Only dentists can acknowledge alerts")
    success = alert_service.acknowledge_alert(data.alert_id, user.id, data.notes)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"success": True, "message": "Alert acknowledged"}


@router.post("/dismiss")
async def dismiss_alert(data: AlertDismiss, user: User = Depends(get_current_user)):
    """Dismiss an alert"""
    if user.role != "dentist":
        raise HTTPException(status_code=403, detail="Only dentists can dismiss alerts")
    success = alert_service.dismiss_alert(data.alert_id, user.id, data.reason)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"success": True, "message": "Alert dismissed"}


@router.post("/resolve/{alert_id}")
async def resolve_alert(alert_id: str, user: User = Depends(get_current_user)):
    """Mark an alert as resolved"""
    if user.role != "dentist":
        raise HTTPException(status_code=403, detail="Only dentists can resolve alerts")
    success = alert_service.resolve_alert(alert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"success": True, "message": "Alert resolved"}


@router.get("/patient/{patient_id}")
async def get_patient_alerts(patient_id: str, user: User = Depends(get_current_user)):
    """Get all alerts for a specific patient"""
    if user.role != "dentist":
        raise HTTPException(status_code=403, detail="Only dentists can view patient alerts")
    alerts = alert_service.get_alerts_for_patient(patient_id)
    return {"alerts": [a.to_dict() for a in alerts]}
 
