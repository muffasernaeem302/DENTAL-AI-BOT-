import type { Patient } from '@/types'

const mockDentist = {
  id: 'd1',
  email: 'dr.chen@clinic.com',
  firstName: 'Emily',
  lastName: 'Chen',
  role: 'dentist' as const,
  phone: '+1 (555) 987-6543',
  specialization: 'General Dentistry',
  licenseNumber: 'DDS-12345',
  bio: 'Dr. Chen has been practicing dentistry for over 15 years with a focus on preventive care.',
  createdAt: '2023-06-01T09:00:00Z',
  updatedAt: '2024-01-10T14:30:00Z',
}

const mockPatients: Patient[] = [
  {
    id: 'p1',
    email: 'sarah.johnson@email.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'patient',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-06-15',
    medicalHistory: 'No significant medical history',
    allergies: ['Penicillin'],
    insuranceProvider: 'Delta Dental',
    insuranceNumber: 'DD-12345678',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'p2',
    email: 'michael.brown@email.com',
    firstName: 'Michael',
    lastName: 'Brown',
    role: 'patient',
    phone: '+1 (555) 234-5678',
    dateOfBirth: '1978-03-22',
    medicalHistory: 'Type 2 Diabetes (controlled)',
    allergies: [],
    insuranceProvider: 'Cigna',
    insuranceNumber: 'CIG-87654321',
    createdAt: '2024-02-20T11:30:00Z',
    updatedAt: '2024-02-20T11:30:00Z',
  },
  {
    id: 'p3',
    email: 'jennifer.davis@email.com',
    firstName: 'Jennifer',
    lastName: 'Davis',
    role: 'patient',
    phone: '+1 (555) 345-6789',
    dateOfBirth: '1992-11-08',
    medicalHistory: 'Asthma',
    allergies: ['Latex', 'Aspirin'],
    insuranceProvider: 'Aetna',
    insuranceNumber: 'AET-11223344',
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-03-10T09:15:00Z',
  },
]

const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const dentistService = {
  async getDentists() {
    await mockDelay(300)
    return { success: true, data: [mockDentist] }
  },

  async getDentist(id: string) {
    await mockDelay(300)
    if (mockDentist.id === id) {
      return { success: true, data: mockDentist }
    }
    throw new Error('Dentist not found')
  },

  async getPatients() {
    await mockDelay(400)
    return { success: true, data: mockPatients }
  },

  async getPatient(id: string) {
    await mockDelay(300)
    const patient = mockPatients.find((p) => p.id === id)
    if (!patient) throw new Error('Patient not found')
    return { success: true, data: patient }
  },

  async getPatientSummary(_patientId: string) {
    await mockDelay(1000)
    return {
      success: true,
      data: {
        summary: `Patient has been visiting the clinic for regular check-ups. Overall oral health is good with minor concerns about gum sensitivity. Last visit showed no cavities. Patient maintains decent oral hygiene but could improve daily flossing habits.`,
        keyPoints: [
          'Last dental check-up: September 3, 2026',
          'No cavities detected in recent visit',
          'Minor gum sensitivity noted',
          'Allergic to Penicillin',
          'Insurance: Delta Dental (DD-12345678)',
        ],
      },
    }
  },
}
