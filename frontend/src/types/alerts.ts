// Alert types for dentist dashboard

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'DISMISSED' | 'RESOLVED';

export interface DentistAlert {
  id: string;
  patient_id: string;
  patient_name: string;
  severity: AlertSeverity;
  status: AlertStatus;
  reason_codes: string[];
  chief_complaint: string | null;
  pain_level: number | null;
  symptoms: {
    swelling: boolean | null;
    bleeding: boolean | null;
    fever: boolean | null;
    difficulty_chewing: boolean | null;
  };
  recommended_action: string;
  created_at: string;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  notes: string | null;
}

export interface AlertCounts {
  total: number;
  active: number;
  acknowledged: number;
  resolved: number;
  dismissed: number;
}

export interface AlertsResponse {
  alerts: DentistAlert[];
  counts: AlertCounts;
}

export interface SafetyResult {
  level: 'ROUTINE' | 'PRIORITY' | 'ESCALATE';
  reason_codes: string[];
  recommended_action: string;
  patient_message: string;
  requires_professional: boolean;
}

// Severity badge colors
export const severityColors: Record<AlertSeverity, string> = {
  CRITICAL: 'bg-red-100 text-red-800 border-red-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  LOW: 'bg-blue-100 text-blue-800 border-blue-200',
};

// Status badge colors
export const statusColors: Record<AlertStatus, string> = {
  ACTIVE: 'bg-red-100 text-red-800',
  ACKNOWLEDGED: 'bg-yellow-100 text-yellow-800',
  DISMISSED: 'bg-gray-100 text-gray-800',
  RESOLVED: 'bg-green-100 text-green-800',
};
 
