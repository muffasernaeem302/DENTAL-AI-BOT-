import { Link } from 'react-router-dom'
import { Card, CardTitle, Badge, Button, Spinner, EmptyState } from '@/components/ui'
import { Calendar, MessageSquare, User, RefreshCw, AlertCircle } from 'lucide-react'
import { useAppointments, useAuth } from '@/hooks'
import { apiClient } from '@/services'

export function PatientDashboardPage() {
  const { appointments, isLoading, error, refetch } = useAppointments()
  const { user } = useAuth()
  
  const userData = user || apiClient.getUser()
  const firstName = userData?.full_name?.split(' ')[0] || 'there'
  
  const upcoming = appointments
    .filter((a) => a.status === 'scheduled' || a.status === 'confirmed')
    .slice(0, 3)

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    } catch { return dateStr }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Welcome back, {firstName}!</h1>
          <p className="text-neutral-600">Here's your dental care overview</p>
        </div>
        <Link to="/patient/appointments"><Button>Book Appointment</Button></Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/patient/chat"><Card hover className="h-full cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary-600" />
            </div>
            <div><h3 className="font-semibold">AI Assistant</h3><p className="text-sm text-neutral-600">Ask questions anytime</p></div>
          </div>
        </Card></Link>
        <Link to="/patient/appointments"><Card hover className="h-full cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-dental-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-dental-600" />
            </div>
            <div><h3 className="font-semibold">Appointments</h3><p className="text-sm text-neutral-600">View & manage visits</p></div>
          </div>
        </Card></Link>
        <Link to="/patient/profile"><Card hover className="h-full cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <User className="w-6 h-6 text-amber-600" />
            </div>
            <div><h3 className="font-semibold">My Profile</h3><p className="text-sm text-neutral-600">Update your info</p></div>
          </div>
        </Card></Link>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <CardTitle>Upcoming Appointments</CardTitle>
          <button onClick={refetch} className="p-2 hover:bg-neutral-100 rounded-lg" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 text-neutral-500 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <EmptyState
            icon={<AlertCircle className="w-12 h-12" />}
            title="Unable to load appointments"
            description={error}
            action={<Button onClick={refetch}>Try Again</Button>}
          />
        ) : upcoming.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-12 h-12" />}
            title="No upcoming appointments"
            description="Schedule a visit to maintain your oral health."
            action={<Button onClick={() => { window.location.href = '/patient/appointments' }}>Schedule Now</Button>}
          />
        ) : (
          <div className="space-y-4 mt-4">
            {upcoming.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium">{apt.type}</p>
                    <p className="text-sm text-neutral-600">with Dr. {apt.dentist_name || 'TBD'}</p>
                  </div>
                </div>
                <div className="text-right mr-4">
                  <p className="font-medium">{formatDate(apt.date)}</p>
                  <p className="text-sm text-neutral-600">{apt.start}</p>
                </div>
                <Badge variant={apt.status === 'confirmed' ? 'success' : 'primary'}>{apt.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="bg-gradient-to-r from-primary-50 to-dental-50">
        <h3 className="font-semibold text-neutral-900 mb-1">Oral Health Tip</h3>
        <p className="text-sm text-neutral-700">Remember to brush for two minutes twice daily and floss at least once. Regular check-ups help prevent cavities and gum disease!</p>
      </Card>
    </div>
  )
}
