// Patient Intake Types

export interface IntakeData {
  chief_complaint: string | null;
  location: string | null;
  duration: string | null;
  pain_level: number | null;
  swelling: boolean | null;
  bleeding: boolean | null;
  sensitivity: boolean | null;
  difficulty_chewing: boolean | null;
  fever: boolean | null;
  recent_procedure: string | null;
  notes: string | null;
}

export interface Intake {
  id: string;
  patient_id: string;
  chief_complaint: string | null;
  location: string | null;
  duration: string | null;
  pain_level: number | null;
  swelling_reported: boolean | null;
  bleeding_reported: boolean | null;
  sensitivity_reported: boolean | null;
  difficulty_chewing_reported: boolean | null;
  fever_reported: boolean | null;
  recent_procedure: string | null;
  additional_notes: string | null;
  flags_for_dentist: string[];
  is_complete: boolean;
  structured_data: IntakeData;
  created_at: string;
}

export interface IntakeProgress {
  chief_complaint: boolean;
  duration: boolean;
  pain_level: boolean;
  location: boolean;
  symptoms: boolean; // any symptom flag
  recent_procedure: boolean;
  notes: boolean;
}

export const INITIAL_PROGRESS: IntakeProgress = {
  chief_complaint: false,
  duration: false,
  pain_level: false,
  location: false,
  symptoms: false,
  recent_procedure: false,
  notes: false,
};

export const SCREENING_FIELDS = [
  { key: 'chief_complaint', label: 'Main concern', icon: '📋' },
  { key: 'duration', label: 'Duration', icon: '⏱️' },
  { key: 'pain_level', label: 'Pain level', icon: '📊' },
  { key: 'location', label: 'Location', icon: '📍' },
  { key: 'symptoms', label: 'Other symptoms', icon: '🩺' },
] as const;
 
