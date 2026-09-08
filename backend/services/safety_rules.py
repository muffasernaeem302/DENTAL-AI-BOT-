"""DentalAI Safety Rules - Deterministic Emergency Detection"""
from enum import Enum
from dataclasses import dataclass, field
from typing import Optional
import re


class EscalationLevel(Enum):
    ROUTINE = "ROUTINE"
    PRIORITY = "PRIORITY"
    ESCALATE = "ESCALATE"


@dataclass
class SafetyResult:
    level: EscalationLevel
    reason_codes: list[str] = field(default_factory=list)
    recommended_action: str = ""
    patient_message: str = ""
    requires_professional: bool = False
    
    def to_dict(self) -> dict:
        return {"level": self.level.value, "reason_codes": self.reason_codes,
                "recommended_action": self.recommended_action, "patient_message": self.patient_message,
                "requires_professional": self.requires_professional}


@dataclass
class SafetyInput:
    chief_complaint: Optional[str] = None
    pain_level: Optional[int] = None
    swelling: Optional[bool] = None
    bleeding: Optional[bool] = None
    fever: Optional[bool] = None
    notes: Optional[str] = None
    raw_message: Optional[str] = None


class SafetyRules:
    """Deterministic safety rule engine for dental urgency detection."""
    
    # Escalate patterns (highest priority)
    ESCALATE_PATTERNS = [
        (r'severe|extreme|unbearable|excruciating', 'SEVERE_PAIN'),
        (r'cant breathe|cannot breathe|cant swallow', 'BREATHING_DIFFICULTY'),
        (r'wont stop|won.t stop|cannot stop|not stop', 'UNCONTROLLED_BLEEDING'),
        (r'uncontrolled bleeding', 'UNCONTROLLED_BLEEDING'),
        (r'broken tooth|fractured tooth|knocked out', 'TRAUMA_INJURY'),
        (r'fever.*pain|fever.*swelling', 'FEVER_WITH_PAIN'),
    ]
    
    # Priority patterns
    PRIORITY_PATTERNS = [
        (r'moderate.*pain|moderate.*swelling', 'MODERATE_SWELLING'),
        (r'swelling.*worsening|swelling.*increasing', 'MODERATE_SWELLING'),
        (r'cant open jaw|jaw locked', 'LOCKED_JAW'),
        (r'very.*sensitive', 'SEVERE_SENSITIVITY'),
        (r'sensitive|sensitivity', 'SENSITIVITY'),
    ]
    
    def evaluate(self, inp: SafetyInput) -> SafetyResult:
        """Evaluate input against deterministic rules."""
        reasons = []
        level = EscalationLevel.ROUTINE
        
        text = ' '.join(p for p in [inp.chief_complaint, inp.raw_message, inp.notes] if p).lower()
        
        # Check ESCALATE patterns first
        for pattern, code in self.ESCALATE_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                reasons.append(code)
                level = EscalationLevel.ESCALATE
                break
        
        # Check PRIORITY patterns
        if level != EscalationLevel.ESCALATE:
            for pattern, code in self.PRIORITY_PATTERNS:
                if re.search(pattern, text, re.IGNORECASE):
                    reasons.append(code)
                    level = EscalationLevel.PRIORITY
                    break
        
        # Pain level numerical check
        if inp.pain_level is not None:
            if inp.pain_level >= 8:
                reasons.append('SEVERE_PAIN')
                level = EscalationLevel.ESCALATE
            elif inp.pain_level >= 6:
                reasons.append('MODERATE_PAIN')
                if level == EscalationLevel.ROUTINE:
                    level = EscalationLevel.PRIORITY
        
        # Fever + pain check
        if inp.fever and inp.pain_level and inp.pain_level > 3:
            reasons.append('FEVER_WITH_PAIN')
            level = EscalationLevel.ESCALATE
        
        # Boolean bleeding check
        if inp.bleeding:
            reasons.append('PERSISTENT_BLEEDING')
            if level == EscalationLevel.ROUTINE:
                level = EscalationLevel.PRIORITY
        
        reasons = list(set(reasons))
        
        msgs = {
            EscalationLevel.ESCALATE: "Seek immediate care. Contact emergency services or our urgent line.",
            EscalationLevel.PRIORITY: "Schedule within 24-48 hours. Call our office.",
            EscalationLevel.ROUTINE: "We'll include this in your visit preparation."
        }
        
        return SafetyResult(level=level, reason_codes=reasons, recommended_action=msgs[level],
                           patient_message=msgs[level], requires_professional=level != EscalationLevel.ROUTINE)
    
    def evaluate_from_dict(self, data: dict) -> SafetyResult:
        return self.evaluate(SafetyInput(chief_complaint=data.get('chief_complaint'),
            pain_level=data.get('pain_level'), swelling=data.get('swelling'),
            bleeding=data.get('bleeding'), fever=data.get('fever'),
            notes=data.get('notes'), raw_message=data.get('raw_message')))


safety_rules = SafetyRules()
 
