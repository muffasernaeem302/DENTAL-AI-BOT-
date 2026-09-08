import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, canAccessDentistDashboard, canAccessAdminPanel } from '@/hooks'
import { Spinner } from '@/components/ui'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
  requireDentist?: boolean
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, allowedRoles, requireDentist, requireAdmin }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check admin access
  if (requireAdmin && !canAccessAdminPanel(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  // Check dentist access
  if (requireDentist && !canAccessDentistDashboard(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  // Check specific roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}