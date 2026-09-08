import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Button, Spinner } from '@/components/ui'
import { Calendar, Clock, CheckCircle, AlertTriangle, AlertCircle, RefreshCw, Eye } from 'lucide-react'
import { useAppointments } from '@/hooks'
import { alertsApi, sortAlertsBySeverity } from '@/services/alertsApi'
import { DentistAlert, severityColors } from '@/types/alerts'
import type { Appointment } from '@/services'

export function DentistDashboardPage() {
  const { appointments, isLoading, error, refetch } = useAppointments()
  const [alerts, setAlerts] = useState<DentistAlert[]>([])
  const today = new Date().toISOString().split('T')[0]
  const todayAppts = appointments.filter((a) => a.date?.startsWith(today))
  const upcoming = appointments.filter((a) => a.date > today && a.status !== 'cancelled').slice(0, 5)
  const counts = appointments.reduce<Partial<Record<Appointment['status'], number>>>((acc, apt) => { acc[apt.status] = (acc[apt.status] || 0) + 1; return acc }, {})
  useEffect(() => { alertsApi.getAlerts().then(r => setAlerts(sortAlertsBySeverity(r.alerts))).catch(() => {}) }, [])
  const badge = (s: Appointment['status']) => <span className={"px-2 py-1 text-xs rounded " + (s === 'confirmed' ? 'bg-green-100 text-green-800' : s === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800')}>{s}</span>
  const type = (t: string) => ({ checkup: 'Check-up', cleaning: 'Cleaning', emergency: 'Emergency', consultation: 'Consultation', follow_up: 'Follow-up' }[t] || t)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-neutral-500">{new Date().toLocaleDateString()}</p></div>
        <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading}><RefreshCw className={"w-4 h-4 mr-2 " + (isLoading ? 'animate-spin' : '')} />Refresh</Button>
      </div>
      {alerts.length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-600" /><h2 className="font-semibold text-red-800">{alerts.length} Alert{alerts.length > 1 ? 's' : ''}</h2></div><Link to="/dentist/alerts"><Button variant="ghost" size="sm" className="text-red-700">View All</Button></Link></div>
          <div className="grid md:grid-cols-3 gap-3">{alerts.slice(0, 3).map((a) => (<div key={a.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100"><div className="flex items-center gap-3"><span className={"px-2 py-0.5 text-xs rounded border " + severityColors[a.severity]}>{a.severity}</span><div><p className="font-medium text-sm">{a.patient_name}</p><p className="text-xs text-neutral-500">{a.chief_complaint || 'Concern'}</p></div></div><Link to={"/dentist/patients/" + a.patient_id}><Button variant="ghost" size="sm">View</Button></Link></div>))}</div>
        </Card>
      )}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Calendar className="w-5 h-5 text-blue-600" /></div><div><p className="text-xl font-bold">{todayAppts.length}</p><p className="text-xs text-neutral-500">Today</p></div></div></Card>
        <Card className="p-4"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600" /></div><div><p className="text-xl font-bold">{counts.completed || 0}</p><p className="text-xs text-neutral-500">Completed</p></div></div></Card>
        <Card className="p-4"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div><div><p className="text-xl font-bold">{counts.scheduled || 0}</p><p className="text-xs text-neutral-500">Scheduled</p></div></div></Card>
        <Card className="p-4"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center"><AlertCircle className="w-5 h-5 text-neutral-600" /></div><div><p className="text-xl font-bold">{counts.cancelled || 0}</p><p className="text-xs text-neutral-500">Cancelled</p></div></div></Card>
      </div>
      <Card>
        <div className="flex items-center justify-between p-4 border-b"><h2 className="font-semibold">Todays Appointments</h2><Link to="/dentist/appointments"><Button variant="ghost" size="sm">View All</Button></Link></div>        {isLoading ? <div className="py-12 flex justify-center"><Spinner size="lg" /></div> : error ? <div className="p-8 text-red-600">{error}</div> : todayAppts.length === 0 ? <div className="p-8 text-center text-neutral-500"><Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No appointments today</p></div> : (
          <table className="w-full"><thead className="bg-neutral-50 border-b"><tr><th className="text-left px-4 py-3 text-xs uppercase">Patient</th><th className="text-left px-4 py-3 text-xs uppercase">Time</th><th className="text-left px-4 py-3 text-xs uppercase">Type</th><th className="text-left px-4 py-3 text-xs uppercase">Status</th><th className="text-left px-4 py-3 text-xs uppercase">Actions</th></tr></thead><tbody className="divide-y">{todayAppts.map((apt) => (<tr key={apt.id} className="hover:bg-neutral-50"><td className="px-4 py-3"><Link to={"/dentist/patients/" + apt.patient_id} className="font-medium text-primary-700">{apt.patient_name || 'Patient'}</Link></td><td className="px-4 py-3 text-sm">{apt.start}{apt.end && " - " + apt.end}</td><td className="px-4 py-3 text-sm">{type(apt.type)}</td><td className="px-4 py-3">{badge(apt.status)}</td><td className="px-4 py-3"><Link to={"/dentist/patients/" + apt.patient_id}><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></Link></td></tr>))}</tbody></table>
        )}
      </Card>
      <Card>
        <div className="flex items-center justify-between p-4 border-b"><h2 className="font-semibold">Upcoming</h2><Link to="/dentist/appointments"><Button variant="ghost" size="sm">View All</Button></Link></div>
        {upcoming.length === 0 ? <div className="p-8 text-center text-neutral-500">No upcoming appointments</div> : (<div className="divide-y">{upcoming.map((apt) => (<div key={apt.id} className="flex items-center justify-between p-4"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-medium">{apt.patient_name?.[0] || 'P'}</div><div><p className="font-medium">{apt.patient_name || 'Patient'}</p><p className="text-sm text-neutral-500">{type(apt.type)}</p></div></div><div className="text-right"><p className="font-medium">{apt.date && new Date(apt.date).toLocaleDateString()}</p><p className="text-sm text-neutral-500">{apt.start}</p></div></div>))}</div>)}
      </Card>
    </div>
  )
}
