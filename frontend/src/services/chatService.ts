import type { Message } from '@/types'
import type { IntakeData } from '@/types/intake'
import { apiClient } from './api'

interface ChatResponse {
  message: string
  intent: string
  agent: string
  conversation_id: string
  intake_data?: IntakeData
  collected_fields?: string[]
  is_complete?: boolean
}

let localMessages: Message[] = [{
  id: 'init-1', role: 'assistant',
  content: "Hello! I'm your DentalAI assistant. I can help with appointments, dental questions, or pre-visit information.",
  timestamp: new Date().toISOString(),
}]

let currentConversationId: string | null = null
const mockDelay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const mockResponses: Record<string, string[]> = {
  APPOINTMENT_REQUEST: ["I can help schedule an appointment. What time works for you?"],
  GENERAL_CLINIC_QUESTION: ["That's a good question. Let me help with that."],
  PRE_VISIT_INTAKE: ["Thanks for sharing. To help the dentist prepare, may I ask a few questions?"],
  FOLLOW_UP: ["That's a good question about your care. Here's some guidance..."],
}

export const chatService = {
  async getMessages() {
    if (!currentConversationId) return { success: true, data: localMessages }

    try {
      const res = await apiClient.request<{ messages: Array<{ id: string; role: Message['role']; content: string; created_at: string }> }>(`/ai/chat/${currentConversationId}`)
      if (res.success && res.data?.messages) {
        const formatted = res.data.messages.map((m) => ({
          id: m.id, role: m.role, content: m.content, timestamp: m.created_at,
        }))
        localMessages = formatted
        return { success: true, data: formatted }
      }
    } catch {}
    return { success: true, data: localMessages }
  },

  async sendMessage(content: string): Promise<{ success: boolean; data?: ChatResponse; intake_data?: IntakeData }> {
    const userMsg: Message = { id: `m${Date.now()}`, role: 'user', content, timestamp: new Date().toISOString() }
    localMessages.push(userMsg)

    try {
      const formData = new FormData()
      formData.append('message', content)
      if (currentConversationId) formData.append('conversation_id', currentConversationId)
      const token = localStorage.getItem('access_token')
      const apiBaseUrl = import.meta.env.VITE_API_URL || '/api'
      const res = await fetch(`${apiBaseUrl}/ai/chat`, {
        method: 'POST', headers: token ? { 'Authorization': `Bearer ${token}` } : {}, body: formData,
      })
      if (res.ok) {
        const data: ChatResponse = await res.json()
        currentConversationId = data.conversation_id
        localMessages.push({ id: `m${Date.now()}-ai`, role: 'assistant', content: data.message, timestamp: new Date().toISOString() })
        return { success: true, data, intake_data: data.intake_data }
      }
    } catch {}

    await mockDelay(500)
    const intent = detectIntent(content)
    const aiContent = mockResponses[intent]?.[0] || mockResponses.GENERAL_CLINIC_QUESTION[0]
    localMessages.push({ id: `m${Date.now()}-ai`, role: 'assistant', content: aiContent, timestamp: new Date().toISOString() })
    return { success: true, data: { message: aiContent, intent, agent: 'assistant', conversation_id: 'mock' } }
  },

  async clearHistory() {
    localMessages = [{ id: 'init-1', role: 'assistant', content: "Hello! How can I help you today?", timestamp: new Date().toISOString() }]
    currentConversationId = null
    return { success: true }
  },
}

function detectIntent(content: string): string {
  const lower = content.toLowerCase()
  if (lower.includes('appointment') || lower.includes('schedule')) return 'APPOINTMENT_REQUEST'
  if (lower.includes('hurt') || lower.includes('pain')) return 'PRE_VISIT_INTAKE'
  if (lower.includes('after') || lower.includes('recovery')) return 'FOLLOW_UP'
  return 'GENERAL_CLINIC_QUESTION'
}
 
