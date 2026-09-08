// Follow-up Types for the DentalAI Follow-up Agent

export type FollowUpType = 
  | "appointment_reminder"
  | "missed_appointment"
  | "post_visit_checkin"
  | "followup_appointment_reminder";

export type FollowUpStatus = 
  | "pending"
  | "scheduled"
  | "sent"
  | "delivered"
  | "failed"
  | "cancelled"
  | "opt_out";

export type NotificationChannel = "email" | "sms" | "whatsapp" | "mock";

export interface FollowUpMessage {
  templateId: string;
  subject?: string;
  body: string;
  channel: NotificationChannel;
}

export interface FollowUpTask {
  id: string;
  patientId: string;
  appointmentId?: string;
  type: FollowUpType;
  scheduledFor: Date;
  status: FollowUpStatus;
  channel: NotificationChannel;
  message: FollowUpMessage;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FollowUpOptOut {
  patientId: string;
  channel: NotificationChannel;
  optedOutAt: Date;
  reason?: string;
}

export interface NotificationLog {
  id: string;
  followUpTaskId: string;
  patientId: string;
  channel: NotificationChannel;
  status: "pending" | "sent" | "delivered" | "failed";
  errorMessage?: string;
  timestamp: Date;
}

export interface FollowUpSchedule {
  type: FollowUpType;
  channel: NotificationChannel;
  delayHours: number; // Hours after event
  templateId: string;
}

// Follow-up message templates (non-clinical, administrative only)
export const FOLLOWUP_TEMPLATES = {
  appointment_reminder: {
    id: "appt_reminder",
    subject: "Appointment Reminder - DentalAI Clinic",
    body: "Hi {{patientName}}, this is DentalAI from {{clinicName}}. We wanted to remind you of your upcoming dental appointment on {{appointmentDate}} at {{appointmentTime}}. If you need to reschedule, please contact us at {{clinicPhone}}. Reply STOP to opt out.",
  },
  missed_appointment: {
    id: "missed_appt",
    subject: "We Missed You - DentalAI Clinic",
    body: "Hi {{patientName}}, this is DentalAI from {{clinicName}}. We noticed you weren't able to make it to your appointment on {{appointmentDate}}. We'd love to help you reschedule at your convenience. Please contact us at {{clinicPhone}} or reply to book your next visit. Reply STOP to opt out.",
  },
  post_visit_checkin: {
    id: "post_visit",
    subject: "How Are You Feeling? - DentalAI Clinic",
    body: "Hi {{patientName}}, this is DentalAI from {{clinicName}}. We're checking in after your recent appointment. If you have any questions or would like to schedule a follow-up, we're here to help. Contact us at {{clinicPhone}}. Reply STOP to opt out.",
  },
  followup_appointment_reminder: {
    id: "followup_reminder",
    subject: "Follow-up Appointment Available - DentalAI Clinic",
    body: "Hi {{patientName}}, this is DentalAI from {{clinicName}}. Based on your recent visit, we recommend scheduling a follow-up appointment. Please contact us at {{clinicPhone}} to book your next visit at a time that works for you. Reply STOP to opt out.",
  },
} as const;

// Default scheduling rules
export const FOLLOWUP_SCHEDULES: FollowUpSchedule[] = [
  {
    type: "appointment_reminder",
    channel: "sms",
    delayHours: 24,
    templateId: "appt_reminder",
  },
  {
    type: "missed_appointment",
    channel: "sms",
    delayHours: 2,
    templateId: "missed_appt",
  },
  {
    type: "post_visit_checkin",
    channel: "email",
    delayHours: 48,
    templateId: "post_visit",
  },
  {
    type: "followup_appointment_reminder",
    channel: "email",
    delayHours: 72,
    templateId: "followup_reminder",
  },
];

// Clinic configuration (would come from settings in production)
export const CLINIC_CONFIG = {
  name: "DentalAI Clinic",
  phone: "(555) 123-4567",
  email: "contact@dentalai.com",
};
