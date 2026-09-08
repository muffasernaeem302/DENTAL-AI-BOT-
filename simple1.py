f=open('e:/DENTALAIAGENT/frontend/src/pages/dentist/DentistPatientDetailPage.tsx','w')
f.write("""import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Badge, Button, Avatar, Spinner } from '@/components/ui'
import { ArrowLeft, Mail, Phone, Calendar, AlertTriangle, Edit2 } from 'lucide-react'
import { alertsApi } from '@/services/alertsApi'

export function DentistPatientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [intakes, setIntakes] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [aiSummary, setAiSummary] = useState('')
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview'|'appointments'|'intake'|'notes'>('overview')

  useEffect(() => { if (id) loadPatientData() }, [id])

  const loadPatientData = async () => {
    setLoading(true)
    try {
      setPatient({ id: id!, full_name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1 (555) 123-4567', created_at: '2026-01-15' })
      setAppointments([{ id: '1', date: '2026-09-03', start: '10:00', type: 'checkup', status: 'completed', notes: 'Routine checkup' }])
      setIntakes([{ id: '1', chief_complaint: 'Tooth pain', location: 'Lower right molar', duration: '3 days', pain_level: 7, swelling: true, sensitivity: true }])
      try { const r = await alertsApi.getPatientAlerts(id!); setAlerts(r.alerts) } catch {}
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const generateAi = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1500))
    if (intakes[0]) setAiSummary('Patient: ' + intakes[0].chief_complaint + '. Pain: ' + intakes[0].pain_level + '/10.')
    setGenerating(false)
  }

  if (loading) return <div className="flex justify-center items-center min-h-[400px]"><Spinner size="lg" /></div>
  if (!patient) return <div className="p-8 text-center">Patient not found</div>

  const li = intakes[0]
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-neutral-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <Avatar firstName={patient.full_name.split(' ')[0]} lastName={patient.full_name.split(' ')[1]||''} size="lg" />
          <div><h1 className="text-2xl font-bold">{patient.full_name}</h1><p className="text-neutral-500 text-sm">Patient since {new Date(patient.created_at).toLocaleDateString()}</p></div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Edit2 className="w-4 h-4 mr-2" />Edit</Button>
          <Button variant="outline" size="sm"><Calendar className="w-4 h-4 mr-2" />Book</Button>
        </div>
      </div>

      <div className="border-b">
        <nav className="flex gap-6">
          {(['overview','appointments','intake','notes'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={'pb-3 px-1 text-sm font-medium border-b-2 capitalize ' + (activeTab===t?'border-primary-600 text-primary-600':'border-transparent text-neutral-500')}>{t}</button>
          ))}
        </nav>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card><div className="p-4 border-b"><h2 className="font-semibold">Information</h2></div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-neutral-400" /><span className="text-sm">{patient.email}</span></div>
              <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-neutral-400" /><span className="text-sm">{patient.phone||'No phone'}</span></div>
            </div>
          </Card>
""")
f.close()
print('done')