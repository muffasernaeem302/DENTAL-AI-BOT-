import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useAuth } from '@/hooks'
import { apiClient } from '@/services'

interface MainLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  showBack?: boolean
  onBack?: () => void
}

export function MainLayout({ children, title, subtitle, showBack, onBack }: MainLayoutProps) {
  const { user } = useAuth()
  
  const userData = user || apiClient.getUser()
  const userRole = userData?.role as 'patient' | 'dentist' | 'receptionist' | 'admin' || 'patient'
  const userName = userData ? { first: userData.full_name.split(' ')[0], last: userData.full_name.split(' ').slice(1).join(' ') || '' } : { first: 'User', last: '' }

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar userRole={userRole} userName={userName} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title || 'Dashboard'} subtitle={subtitle} showBack={showBack} onBack={onBack} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}