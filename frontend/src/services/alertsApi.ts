// Alerts API service
import api from './api';
import { AlertsResponse, DentistAlert, AlertSeverity } from '../types/alerts';

export const alertsApi = {
  // Get active alerts
  getAlerts: async (): Promise<AlertsResponse> => {
    const response = await api.get<AlertsResponse>('/alerts/');
    if (!response.success || !response.data) throw new Error(response.error || 'Unable to load alerts');
    return response.data;
  },

  // Get all alerts (including resolved/dismissed)
  getAllAlerts: async (): Promise<AlertsResponse> => {
    const response = await api.get<AlertsResponse>('/alerts/all');
    if (!response.success || !response.data) throw new Error(response.error || 'Unable to load alerts');
    return response.data;
  },

  // Get alerts for a specific patient
  getPatientAlerts: async (patientId: string): Promise<{ alerts: DentistAlert[] }> => {
    const response = await api.get<{ alerts: DentistAlert[] }>(`/alerts/patient/${patientId}`);
    if (!response.success || !response.data) throw new Error(response.error || 'Unable to load alerts');
    return response.data;
  },

  // Acknowledge an alert
  acknowledgeAlert: async (alertId: string, notes?: string): Promise<void> => {
    await api.post('/alerts/acknowledge', { alert_id: alertId, notes });
  },

  // Dismiss an alert
  dismissAlert: async (alertId: string, reason: string): Promise<void> => {
    await api.post('/alerts/dismiss', { alert_id: alertId, reason });
  },

  // Resolve an alert
  resolveAlert: async (alertId: string): Promise<void> => {
    await api.post(`/alerts/resolve/${alertId}`);
  },
};

// Helper to sort alerts by severity
export const sortAlertsBySeverity = (alerts: DentistAlert[]): DentistAlert[] => {
  const severityOrder: Record<AlertSeverity, number> = {
    CRITICAL: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
  };
  
  return [...alerts].sort((a, b) => 
    severityOrder[a.severity] - severityOrder[b.severity]
  );
};

// Format time ago
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};
 
