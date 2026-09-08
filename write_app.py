app="""import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { DentistLayout } from './components/layout/DentistLayout'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { PatientChatPage } from './pages/patient/PatientChatPage'
import { PatientAppointmentsPage } from './pages/patient/PatientAppointmentsPage'
import { PatientProfilePage } from './pages/patient/PatientProfilePage'
import { PatientDashboardPage } from './pages/patient/PatientDashboardPage'
import { DentistDashboardPage } from './pages/dentist/DentistDashboardPage'
import { DentistAppointmentsPage } from './pages/dentist/DentistAppointmentsPage'
import { DentistPatientsPage } from './pages/dentist/DentistPatientsPage'
import { DentistPatientDetailPage } from './pages/dentist/DentistPatientDetailPage'
import { SettingsPage } from './pages/SettingsPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Access Denied</h1><p className="mt-2">You don't have permission to access this page.</p><a href="/" className="text-primary-600 mt-4 inline-block">Go Home</a></div>} />
      
      {/* Patient Routes - Protected */}
      <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']}><MainLayout><PatientDashboardPage /></MainLayout></ProtectedRoute>} />
      <Route path="/patient/chat" element={<ProtectedRoute allowedRoles={['patient']}><MainLayout><PatientChatPage /></MainLayout></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={['patient']}><MainLayout><PatientAppointmentsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/patient/profile" element={<ProtectedRoute allowedRoles={['patient']}><MainLayout><PatientProfilePage /></MainLayout></ProtectedRoute>} />
      
      {/* Dentist Routes - Protected */}
      <Route path="/dentist" element={<ProtectedRoute requireDentist><DentistLayout><DentistDashboardPage /></DentistLayout></ProtectedRoute>} />
      <Route path="/dentist/appointments" element={<ProtectedRoute requireDentist><DentistLayout><DentistAppointmentsPage /></DentistLayout></ProtectedRoute>} />
      <Route path="/dentist/patients" element={<ProtectedRoute requireDentist><DentistLayout><DentistPatientsPage /></DentistLayout></ProtectedRoute>} />
      <Route path="/dentist/patients/:id" element={<ProtectedRoute requireDentist><DentistLayout><DentistPatientDetailPage /></DentistLayout></ProtectedRoute>} />
      
      {/* Settings - Any authenticated user */}
      <Route path="/settings" element={<ProtectedRoute><MainLayout><SettingsPage /></MainLayout></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App"""
open('e:/DENTALAIAGENT/frontend/src/App.tsx','w',encoding='utf-8').write(app)
print('done')