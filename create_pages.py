import os
dashboard = r"""import { useState, useEffect } from 'react'
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
  const statusBadge = (s: string) => {
    const colors: Record<string, string> = { confirmed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800', completed: 'bg-neutral-100 text-neutral-800' }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[s] || 'bg-blue-100 text-blue-800'}`}>{s}</span>
  }
  const typeLabel = (t: string) => ({ checkup: 'Check-up', cleaning: 'Cleaning', emergency: 'Emergency', consultation: 'Consultation', follow_up: 'Follow-up' }[t] || t)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-neutral-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p></div>
        <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading}><RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />Refresh</Button>
      </div>"""
with open(r'e:\DENTALAIAGENT\frontend\src\pages\dentist\DentistDashboardPage.tsx', 'w', encoding='utf-8') as f:
    f.write(dashboard)
print("Part 1 done")"""