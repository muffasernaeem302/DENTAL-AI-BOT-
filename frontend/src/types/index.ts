// User Types
export type UserRole = 'patient' | 'dentist' | 'receptionist' | 'admin'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  phone?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Patient extends User {
  role: 'patient'
  dateOfBirth?: string
  medicalHistory?: string
  allergies?: string[]
  insuranceProvider?: string
  insuranceNumber?: string
}

export interface Dentist extends User {
  role: 'dentist'
  specialization?: string
  licenseNumber?: string
  bio?: string
}

// Appointment Types
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  dentistId: string
  dentistName: string
  dateTime: string
  duration: number // in minutes
  status: AppointmentStatus
  type: string
  notes?: string
  reason?: string
}

// Chat Types
export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  patientId: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

// AI Summary Types
export interface PatientSummary {
  id: string
  patientId: string
  appointmentId?: string
  summary: string
  keyPoints: string[]
  recommendations?: string[]
  generatedAt: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Form Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface AppointmentFormData {
  dentistId: string
  dateTime: string
  duration: number
  type: string
  reason: string
  notes?: string
}

// Navigation Types
export interface NavItem {
  label: string
  path: string
  icon?: string
}
