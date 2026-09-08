/**
 * Centralized API Client for DentalAI
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface User {
  id: string
  full_name: string
  email: string
  phone: string | null
  role: 'admin' | 'dentist' | 'receptionist' | 'patient'
  created_at: string | null
  updated_at: string | null
  // Client-side profile fields are optional until the profile endpoint supplies them.
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  medicalHistory?: string
  allergies?: string[]
  insuranceProvider?: string
  insuranceNumber?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface Appointment {
  id: string
  patient_id: string
  dentist_id: string
  date: string
  start: string
  end: string
  type: string
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  notes: string | null
  patient_name: string | null
  dentist_name: string | null
}

// In development Vite proxies this path to FastAPI, keeping the browser on one origin.
// Deployments with a separate API can still set VITE_API_URL explicitly.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor() {
    this.baseUrl = API_BASE_URL
    this.loadToken()
  }

  private loadToken(): void { this.token = localStorage.getItem('access_token') }
  private saveToken(token: string): void {
    this.token = token
    localStorage.setItem('access_token', token)
  }
  private clearToken(): void {
    this.token = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }
  saveUser(user: User): void { localStorage.setItem('user', JSON.stringify(user)) }
  getUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
  isAuthenticated(): boolean { return !!this.token }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`
    return headers
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (response.status === 401) {
      this.clearToken()
      window.location.href = '/login'
      return { success: false, error: 'Session expired. Please login again.' }
    }
    if (response.status === 403) return { success: false, error: 'Access denied.' }
    if (!response.ok) {
      let errorMessage = `Request failed: ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.detail || errorData.message || errorMessage
      } catch { /* empty */ }
      return { success: false, error: errorMessage }
    }
    if (response.status === 204) return { success: true }
    try {
      const data = await response.json()
      return { success: true, data }
    } catch { return { success: true } }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    try {
      const response = await fetch(url, { ...options, headers: { ...this.getHeaders(), ...options.headers } })
      return this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return { success: false, error: 'Unable to connect to server.' }
      }
      return { success: false, error: error instanceof Error ? error.message : 'An unexpected error' }
    }
  }

  private formBody(values: Record<string, string | undefined>): URLSearchParams {
    const body = new URLSearchParams()
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) body.set(key, value)
    })
    return body
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint)
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) })
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: this.formBody({ email, password }),
    })
    if (response.success && response.data) {
      this.saveToken(response.data.access_token)
      this.saveUser(response.data.user)
    }
    return response
  }

  async register(fullName: string, email: string, password: string, role: string = 'patient', phone?: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: this.formBody({ full_name: fullName, email, password, role, phone }),
    })
    if (response.success && response.data) {
      this.saveToken(response.data.access_token)
      this.saveUser(response.data.user)
    }
    return response
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.request<User>('/auth/me')
    if (response.success && response.data) this.saveUser(response.data)
    return response
  }

  logout(): void { this.clearToken() }

  async getAppointments(params?: { patient_id?: string; dentist_id?: string; status?: string }): Promise<ApiResponse<Appointment[]>> {
    const searchParams = new URLSearchParams()
    if (params?.patient_id) searchParams.set('patient_id', params.patient_id)
    if (params?.dentist_id) searchParams.set('dentist_id', params.dentist_id)
    if (params?.status) searchParams.set('status', params.status)
    return this.request<Appointment[]>(`/appointments${searchParams.toString() ? `?${searchParams}` : ''}`)
  }

  async createAppointment(data: { patient_id: string; dentist_id: string; appointment_date: string; start_time: string; end_time: string; appointment_type: string; notes?: string }): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>('/appointments/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: this.formBody(data),
    })
  }

  async cancelAppointment(id: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return this.request<{ success: boolean; message: string }>(`/appointments/${id}`, { method: 'DELETE' })
  }

  async getPatients(): Promise<ApiResponse<User[]>> { return this.request<User[]>('/patients') }
  async getPatient(id: string): Promise<ApiResponse<User>> { return this.request<User>(`/patients/${id}`) }
}

export const apiClient = new ApiClient()
export default apiClient
