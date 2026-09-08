import { useState } from 'react'
import { Card, CardTitle, Badge, Button, EmptyState } from '@/components/ui'
import { Calendar, Clock, User, Plus, X } from 'lucide-react'
import { useAppointments } from '@/hooks'
import { formatDate, formatTime } from '@/utils'
import type { Appointment } from '@/services'

export function PatientAppointmentsPage() {
  const { appointments, isLoading, cancelAppointment, createAppointment } = useAppointments()
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<'all' | Appointment['status']>('all')

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)
  const counts: Record<'all' | Appointment['status'], number> = { all: appointments.length, scheduled: 0, confirmed: 0, completed: 0, cancelled: 0, in_progress: 0, no_show: 0 }
  appointments.forEach((a) => { counts[a.status]++ })

  const getVariant = (status: Appointment['status']) => {
    if (status === 'confirmed' || status === 'completed') return 'success'
    if (status === 'cancelled') return 'danger'
    if (status === 'no_show') return 'warning'
    return 'primary'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">My Appointments</h1><p className="text-neutral-600">View and manage your visits</p></div>
        <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Book</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'scheduled', 'confirmed', 'completed', 'cancelled'] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === s ? 'bg-primary-100 text-primary-700' : 'bg-white text-neutral-600 hover:bg-neutral-100'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
          </button>
        ))}
      </div>

      {isLoading ? <p className="text-center py-12 text-neutral-500">Loading...</p> : filtered.length === 0 ? (
        <EmptyState icon={<Calendar className="w-12 h-12" />} title="No appointments" description={`No ${filter} appointments.`} action={<Button onClick={() => setShowModal(true)}>Book Now</Button>} />
      ) : (
        <div className="space-y-4">
          {filtered.map((apt) => (
            <Card key={apt.id}>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center"><Calendar className="w-6 h-6 text-primary-600" /></div>
                  <div>
                    <div className="flex items-center gap-2 mb-1"><h3 className="font-semibold">{apt.type}</h3><Badge variant={getVariant(apt.status)}>{apt.status}</Badge></div>
                    <p className="text-sm text-neutral-600">{apt.notes}</p>
                    <div className="flex gap-4 mt-2 text-sm text-neutral-500">
                      <span><User className="w-4 h-4 inline mr-1" />{apt.dentist_name || 'TBD'}</span>
                      <span><Calendar className="w-4 h-4 inline mr-1" />{formatDate(apt.date)}</span>
                      <span><Clock className="w-4 h-4 inline mr-1" />{formatTime(`${apt.date}T${apt.start}`)}</span>
                    </div>
                  </div>
                </div>
                {(apt.status === 'scheduled' || apt.status === 'confirmed') && <Button variant="secondary" size="sm" onClick={() => cancelAppointment(apt.id)}>Cancel</Button>}
              </div>
              {apt.notes && <p className="mt-3 pt-3 border-t text-sm text-neutral-600"><strong>Notes:</strong> {apt.notes}</p>}
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4">
            <div className="flex justify-between items-center mb-4">
              <CardTitle>Book Appointment</CardTitle>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-neutral-600 mb-4">Demo mode: Would show full booking form with date/time selection.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={async () => { const date = new Date(Date.now() + 7 * 86400000); await createAppointment({ patient_id: 'p1', dentist_id: 'd1', appointment_date: date.toISOString().slice(0, 10), start_time: '09:00', end_time: '10:00', appointment_type: 'Check-up', notes: 'Regular check-up' }); setShowModal(false) }}>Book Demo</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
