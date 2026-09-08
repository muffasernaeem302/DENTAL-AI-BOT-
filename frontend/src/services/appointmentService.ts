import type { Appointment } from '@/types'

let mockAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    patientName: 'Sarah Johnson',
    dentistId: 'd1',
    dentistName: 'Dr. Emily Chen',
    dateTime: '2026-09-10T09:00:00Z',
    duration: 60,
    status: 'confirmed',
    type: 'Check-up',
    reason: 'Regular dental check-up and cleaning',
  },
  {
    id: 'a2',
    patientId: 'p1',
    patientName: 'Sarah Johnson',
    dentistId: 'd1',
    dentistName: 'Dr. Emily Chen',
    dateTime: '2026-09-25T14:00:00Z',
    duration: 45,
    status: 'scheduled',
    type: 'Follow-up',
    reason: 'Cavity filling follow-up',
  },
  {
    id: 'a3',
    patientId: 'p1',
    patientName: 'Sarah Johnson',
    dentistId: 'd1',
    dentistName: 'Dr. Emily Chen',
    dateTime: '2026-08-15T10:00:00Z',
    duration: 60,
    status: 'completed',
    type: 'Check-up',
    reason: 'Regular dental check-up',
    notes: 'Teeth in good condition. Recommended continued flossing.',
  },
]

const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const appointmentService = {
  async getAll() {
    await mockDelay(400)
    return { success: true, data: mockAppointments }
  },

  async getById(id: string) {
    await mockDelay(300)
    const appointment = mockAppointments.find((a) => a.id === id)
    if (!appointment) throw new Error('Appointment not found')
    return { success: true, data: appointment }
  },

  async create(data: Partial<Appointment>) {
    await mockDelay(500)
    const newAppointment: Appointment = {
      id: `a${Date.now()}`,
      patientId: 'p1',
      patientName: 'Sarah Johnson',
      dentistId: data.dentistId || '',
      dentistName: data.dentistName || '',
      dateTime: data.dateTime || '',
      duration: data.duration || 60,
      status: 'scheduled',
      type: data.type || '',
      reason: data.reason || '',
    }
    mockAppointments.push(newAppointment)
    return { success: true, data: newAppointment }
  },

  async cancel(id: string) {
    await mockDelay(400)
    const index = mockAppointments.findIndex((a) => a.id === id)
    if (index !== -1) {
      mockAppointments[index].status = 'cancelled'
    }
    return { success: true, data: undefined }
  },

  async update(id: string, data: Partial<Appointment>) {
    await mockDelay(400)
    const index = mockAppointments.findIndex((a) => a.id === id)
    if (index !== -1) {
      mockAppointments[index] = { ...mockAppointments[index], ...data }
      return { success: true, data: mockAppointments[index] }
    }
    throw new Error('Appointment not found')
  },
}
