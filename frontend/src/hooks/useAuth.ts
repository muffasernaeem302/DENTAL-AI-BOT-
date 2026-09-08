import { useState, useEffect, useCallback } from 'react'
import { apiClient, type User } from '@/services'

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isError: boolean
  error: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (user: User) => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const startDemoSession = async () => {
        const response = await apiClient.login('patient@demo.com', 'demo123')
        if (response.success && response.data) {
          setUser(response.data.user)
          return true
        }
        setIsError(true)
        setError(response.error || 'Unable to start the demo session')
        return false
      }

      if (!apiClient.isAuthenticated()) {
        if (import.meta.env.DEV) {
          await startDemoSession()
        }
        setIsLoading(false)
        return
      }

      try {
        const response = await apiClient.getCurrentUser()
        if (response.success && response.data) {
          setUser(response.data)
        } else {
          apiClient.logout()
          if (import.meta.env.DEV) await startDemoSession()
          else {
            setIsError(true)
            setError(response.error || 'Session expired')
          }
        }
      } catch {
        apiClient.logout()
        if (import.meta.env.DEV) await startDemoSession()
        else {
          setIsError(true)
          setError('Failed to verify session')
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    setIsError(false)

    try {
      const response = await apiClient.login(email, password)
      if (response.success && response.data) {
        setUser(response.data.user)
        return { success: true }
      } else {
        setError(response.error || 'Login failed')
        setIsError(true)
        return { success: false, error: response.error }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed'
      setError(errorMsg)
      setIsError(true)
      return { success: false, error: errorMsg }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    apiClient.logout()
    setUser(null)
    setError(null)
    setIsError(false)
    window.location.href = '/login'
  }, [])

  const updateProfile = useCallback((updatedUser: User) => {
    apiClient.saveUser(updatedUser)
    setUser(updatedUser)
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isError,
    error,
    login,
    logout,
    updateProfile,
  }
}

// Helper function for role-based redirect after login
export function getRoleBasedRedirect(role: string): string {
  switch (role) {
    case 'patient':
      return '/patient'
    case 'dentist':
      return '/dentist'
    case 'receptionist':
      return '/receptionist'
    case 'admin':
      return '/admin'
    default:
      return '/'
  }
}

// Role check helpers
export function canAccessDentistDashboard(role: string): boolean {
  return ['dentist', 'admin'].includes(role)
}

export function canAccessAdminPanel(role: string): boolean {
  return role === 'admin'
}

export function canManagePatients(role: string): boolean {
  return ['admin', 'receptionist', 'dentist'].includes(role)
}
