import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Input, Spinner } from '@/components/ui'
import { useAuth, getRoleBasedRedirect } from '@/hooks'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const result = await login(email, password)
      if (result.success) {
        const userData = localStorage.getItem('user')
        if (userData) navigate(getRoleBasedRedirect(JSON.parse(userData).role))
        else navigate('/')
      } else setError(result.error || 'Invalid credentials')
    } catch { setError('An unexpected error') } finally { setIsSubmitting(false) }
  }

  const handleDemoLogin = async (role: 'patient' | 'dentist') => {
    setIsSubmitting(true)
    setError(null)
    const creds = { patient: { email: 'patient@demo.com', password: 'demo123' }, dentist: { email: 'dentist@demo.com', password: 'demo123' } }
    try {
      const result = await login(creds[role].email, creds[role].password)
      if (result.success) navigate(getRoleBasedRedirect(role))
      else setError('Demo unavailable. Start backend server.')
    } catch { setError('Cannot connect to server.') } finally { setIsSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4c-3 0-6 3-6 7 0 3 2 5 4 6v1a1 1 0 001 1h2a1 1 0 001-1v-1c2-1 4-3 4-6 0-4-3-7-6-7z" /></svg>
          </div>
          <span className="font-semibold text-2xl text-white">DentalAI</span>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">AI-powered dental care assistant</h1>
          <p className="text-xl text-primary-100">Streamline your clinic operations with intelligent automation.</p>
          <div className="flex gap-8"><div><p className="text-3xl font-bold text-white">500+</p><p className="text-primary-200">Clinics</p></div><div><p className="text-3xl font-bold text-white">10K+</p><p className="text-primary-200">Patients</p></div></div>
        </div>
        <p className="text-primary-200 text-sm">Trusted by dental professionals</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4c-3 0-6 3-6 7 0 3 2 5 4 6v1a1 1 0 001 1h2a1 1 0 001-1v-1c2-1 4-3 4-6 0-4-3-7-6-7z" /></svg>
            </div>
            <span className="font-semibold text-xl">DentalAI</span>
          </div>
          <Card>
            <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
            <p className="text-neutral-600 mb-4">Sign in to your account</p>
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
            <div className="mb-4 p-4 bg-primary-50 rounded-lg">
              <p className="text-sm font-medium text-primary-800 mb-3">Quick Demo Access</p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => handleDemoLogin('patient')} disabled={isSubmitting}>Patient</Button>
                <Button variant="secondary" className="flex-1" onClick={() => handleDemoLogin('dentist')} disabled={isSubmitting}>Dentist</Button>
              </div>
            </div>
            <div className="relative mb-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-neutral-500">or sign in with email</span></div></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? <Spinner size="sm" /> : 'Sign In'}</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}