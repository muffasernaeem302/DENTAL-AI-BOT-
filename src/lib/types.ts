export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patient: Patient;
  dateTime: Date;
  endTime: Date;
  type: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled" | "no-show";
  notes?: string;
  intake?: PatientIntake;
}

export interface PatientIntake {
  id: string;
  patientId: string;
  patientConcern: string;
  duration: string;
  painLevel: number;
  otherInformation: string;
  symptoms: string[];
  medicalHistory: string[];
  medications: string[];
  allergies: string[];
  conversationSummary: string;
  aiGeneratedSummary: string;
  timestamp: Date;
}

export interface Alert {
  id: string;
  patientId: string;
  patient: Patient;
  type: "appointment" | "intake" | "follow-up" | "prescription" | "urgent";
  priority: "urgent" | "high" | "medium" | "low";
  title: string;
  message: string;
  acknowledged: boolean;
  resolved: boolean;
  resolvedAt?: Date;
  notes: AlertNote[];
  createdAt: Date;
}

export interface AlertNote {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
}

export interface FollowUpTask {
  id: string;
  patientId: string;
  patient: Patient;
  title: string;
  description: string;
  dueDate: Date;
  status: "pending" | "in-progress" | "completed";
  priority: "high" | "medium" | "low";
  createdAt: Date;
}
