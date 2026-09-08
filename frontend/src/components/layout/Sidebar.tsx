import { NavLink, useLocation } from 'react-router-dom'
import { Home, MessageSquare, Calendar, User, Settings, Users, Activity, LogOut } from 'lucide-react'
import { cn } from '@/utils'
import { Avatar } from '@/components/ui'
import { useAuth } from '@/hooks'

const patientNavItems = [
  { label: 'Dashboard', path: '/patient', icon: Home },
  { label: 'AI Assistant', path: '/patient/chat', icon: MessageSquare },
  { label: 'Appointments', path: '/patient/appointments', icon: Calendar },
  { label: 'Profile', path: '/patient/profile', icon: User },
]

const dentistNavItems = [
  { label: 'Dashboard', path: '/dentist', icon: Activity },
  { label: 'Appointments', path: '/dentist/appointments', icon: Calendar },
  { label: 'Patients', path: '/dentist/patients', icon: Users },
]

interface SidebarProps {
  userRole: 'patient' | 'dentist' | 'receptionist' | 'admin'
  userName: { first: string; last: string }
}

export function Sidebar({ userRole, userName }: SidebarProps) {
  const location = useLocation()
  const { logout } = useAuth()
  
  const navItems = userRole === 'patient' ? patientNavItems : dentistNavItems

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4c-3 0-6 3-6 7 0 3 2 5 4 6v1a1 1 0 001 1h2a1 1 0 001-1v-1c2-1 4-3 4-6 0-4-3-7-6-7z" />
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-neutral-900">DentalAI</h1>
            <p className="text-xs text-neutral-500 capitalize">{userRole}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path))
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-neutral-200 space-y-1">
        <NavLink
          to="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            location.pathname === '/settings'
              ? 'bg-primary-50 text-primary-700'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
          )}
        >
          <Settings className="w-5 h-5" />
          Settings
        </NavLink>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
        
        <div className="mt-3 flex items-center gap-3 px-3 py-2">
          <Avatar firstName={userName.first} lastName={userName.last} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {userName.first} {userName.last}
            </p>
            <p className="text-xs text-neutral-500 capitalize">{userRole}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}