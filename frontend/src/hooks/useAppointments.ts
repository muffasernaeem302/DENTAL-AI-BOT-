import { useState, useEffect, useCallback } from 'react'
import { apiClient, type Appointment } from '@/services'

interface UseAppointmentsReturn {
  appointments: Appointment[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  createAppointment: (data: { patient_id: string; dentist_id: string; appointment_date: string; start_time: string; end_time: string; appointment_type: string; notes?: string }) => Promise<{ success: boolean; error?: string }>
  cancelAppointment: (id: string) => Promise<{ success: boolean; error?: string }>
}

export function useAppointments(): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.getAppointments()
      if (response.success && response.data) {
        setAppointments(response.data)
      } else {
        setError(response.error || 'Failed to fetch appointments')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const createAppointment = useCallback(async (data: { patient_id: string; dentist_id: string; appointment_date: string; start_time: string; end_time: string; appointment_type: string; notes?: string }) => {
    const response = await apiClient.createAppointment(data)
    if (response.success && response.data) {
      setAppointments((prev) => [...prev, response.data!])
      return { success: true }
    }
    return { success: false, error: response.error }
  }, [])

  const cancelAppointment = useCallback(async (id: string) => {
    const response = await apiClient.cancelAppointment(id)
    if (response.success) {
      setAppointments((prev) => prev.map((apt) => apt.id === id ? { ...apt, status: 'cancelled' } : apt))
      return { success: true }
    }
    return { success: false, error: response.error }
  }, [])

  return { appointments, isLoading, error, refetch: fetchAppointments, createAppointment, cancelAppointment }
}