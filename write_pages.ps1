$ErrorActionPreference = "Stop"
$dashboardPath = "e:\DENTALAIAGENT\frontend\src\pages\dentist\DentistDashboardPage.tsx"
$detailPath = "e:\DENTALAIAGENT\frontend\src\pages\dentist\DentistPatientDetailPage.tsx"

$dashboard = @"
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Button, Spinner, EmptyState } from '@/components/ui'
import { Calendar, Clock, CheckCircle, AlertTriangle, AlertCircle, RefreshCw, ChevronRight, Eye } from 'lucide-react'
import { useAppointments } from '@/hooks'
import { alertsApi, sortAlertsBySeverity } from '@/services/alertsApi'
import { DentistAlert, severityColors } from '@/types/alerts'

export function DentistDashboardPage() {
  const { appointments, isLoading, error, refetch } = useAppointments()
  const [alerts, setAlerts] = useState<DentistAlert[]>([])
  const today = new Date().toISOString().split('T')[0]
  const todayAppts = appointments.filter((a: any) => a.date?.startsWith(today))
  const upcoming = appointments.filter((a: any) => a.date > today && a.status !== 'cancelled').slice(0, 5)
  const counts = appointments.reduce((acc: Record<string, number>, apt: any) => { acc[apt.status] = (acc[apt.status] || 0) + 1; return acc }, {} as Record<string, number>)
  useEffect(() => { alertsApi.getAlerts().then(r => setAlerts(sortAlertsBySeverity(r.alerts))).catch(() => {}) }, [])
  const sb = (s: string) => <span className={`px-2 py-1 text-xs font-medium rounded-full ${s === 'confirmed' ? 'bg-green-100 text-green-800' : s === 'cancelled' ? 'bg-red-100 text-red-800' : s === 'completed' ? 'bg-neutral-100 text-neutral-800' : 'bg-blue-100 text-blue-800'}`}>{s}</span>
  const tl = (t: string) => ({ checkup: 'Check-up', cleaning: 'Cleaning', emergency: 'Emergency', consultation: 'Consultation', follow_up: 'Follow-up' }[t] || t)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-neutral-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p></div>
        <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading}><RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />Refresh</Button>
      </div>
"@

$dashboard | Out-File -FilePath $dashboardPath -Encoding UTF8