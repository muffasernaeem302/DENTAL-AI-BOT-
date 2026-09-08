import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/utils'
import { 
  LayoutDashboard, Calendar, Users, Bell, Settings, LogOut, 
  ChevronLeft, ChevronRight, Menu, X, ClipboardList
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dentist', icon: LayoutDashboard },
  { name: 'Appointments', href: '/dentist/appointments', icon: Calendar },
  { name: 'Patients', href: '/dentist/patients', icon: Users },
  { name: 'Alerts', href: '/dentist/alerts', icon: Bell },
]

export function DentistLayout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-40 flex items-center px-4">
        <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-neutral-100 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <span className="ml-3 font-semibold">DentalAI Clinic</span>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold">DentalAI</span>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <nav className="p-2">
              {navigation.map(item => {
                const active = location.pathname === item.href
                return (
                  <Link key={item.name} to={item.href} onClick={() => setMobileOpen(false)}
                    className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
                      active ? "bg-primary-50 text-primary-700" : "text-neutral-600 hover:bg-neutral-100")}>
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={cn("hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r transition-all duration-300", sidebarOpen ? "lg:w-64" : "lg:w-20")}>
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && <span className="font-semibold">DentalAI</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navigation.map(item => {
            const active = location.pathname === item.href || (item.href !== '/dentist' && location.pathname.startsWith(item.href))
            return (
              <Link key={item.name} to={item.href}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active ? "bg-primary-50 text-primary-700" : "text-neutral-600 hover:bg-neutral-100")}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t space-y-1">
          <button className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 w-full")}>
            <Settings className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Settings</span>}
          </button>
          <button className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full")}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Sign out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border rounded-full flex items-center justify-center shadow-sm hover:bg-neutral-50">
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main content */}
      <main className={cn("transition-all duration-300 pt-16 lg:pt-0", sidebarOpen ? "lg:ml-64" : "lg:ml-20")}>
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
