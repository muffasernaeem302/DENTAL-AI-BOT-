import { useState } from 'react'
import { Card, Badge, Button, EmptyState } from '@/components/ui'
import { Calendar, Clock } from 'lucide-react'

const mockAppointments = [
  { id: '1', patient: { name: 'Sarah Johnson', id: 'p1' }, dateTime: '2026-09-03T09:00:00', duration: 60, type: 'Check-up', status: 'completed', notes: 'All clear, minor gum sensitivity' },
  { id: '2', patient: { name: 'Michael Brown', id: 'p2' }, dateTime: '2026-09-03T10:30:00', duration: 45, type: 'Filling', status: 'in-progress' },
  { id: '3', patient: { name: 'Jennifer Davis', id: 'p3' }, dateTime: '2026-09-03T14:00:00', duration: 60, type: 'Cleaning', status: 'confirmed' },
  { id: '4', patient: { name: 'Robert Wilson', id: 'p4' }, dateTime: '2026-09-04T09:00:00', duration: 60, type: 'Check-up', status: 'scheduled' },
  { id: '5', patient: { name: 'Emma Thompson', id: 'p5' }, dateTime: '2026-09-04T11:00:00', duration: 90, type: 'Root Canal', status: 'scheduled' },
]

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
const formatTime = (date: string) => new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

export function DentistAppointmentsPage() {
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('today')

  const filtered = mockAppointments.filter((apt) => {
    if (filter === 'today') return apt.dateTime.startsWith('2026-09-03')
    if (filter === 'week') return apt.dateTime.startsWith('2026-09')
    return true
  })

  const getVariant = (status: string) => {
    if (status === 'confirmed' || status === 'completed') return 'success'
    if (status === 'cancelled') return 'danger'
    if (status === 'in-progress') return 'warning'
    return 'primary'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">Appointments</h1><p className="text-neutral-600">Manage your schedule</p></div>
        <Button><Calendar className="w-4 h-4 mr-2" /> New Appointment</Button>
      </div>

      <div className="flex gap-2">
        {[{ key: 'today', label: 'Today' }, { key: 'week', label: 'This Week' }, { key: 'all', label: 'All' }].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key as typeof filter)} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === f.key ? 'bg-primary-100 text-primary-700' : 'bg-white text-neutral-600 hover:bg-neutral-100'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Calendar className="w-12 h-12" />} title="No appointments" description="No appointments found for this period." />
      ) : (
        <div className="space-y-4">
          {filtered.map((apt) => (
            <Card key={apt.id}>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-lg font-bold text-primary-600">{formatTime(apt.dateTime)}</p>
                    <p className="text-xs text-neutral-500">{apt.duration}min</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{apt.patient.name}</h3>
                      <Badge variant={getVariant(apt.status) as any}>{apt.status}</Badge>
                    </div>
                    <p className="text-sm text-neutral-600">{apt.type}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                      <span><Calendar className="w-4 h-4 inline mr-1" />{formatDate(apt.dateTime)}</span>
                      <span><Clock className="w-4 h-4 inline mr-1" />{apt.duration} min</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">View Patient</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
              {apt.notes && <p className="mt-3 pt-3 border-t text-sm text-neutral-600"><strong>Notes:</strong> {apt.notes}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
