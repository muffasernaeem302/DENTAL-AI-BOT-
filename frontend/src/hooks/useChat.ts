import { useState, useEffect, useCallback } from 'react'
import type { Message } from '@/types'
import { chatService } from '@/services'

interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  isSending: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearHistory: () => Promise<void>
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true)
      try {
        const response = await chatService.getMessages()
        if (response.success) {
          setMessages(response.data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch messages')
      } finally {
        setIsLoading(false)
      }
    }
    fetchMessages()
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsSending(true)
    setError(null)
    try {
      const response = await chatService.sendMessage(content)
      if (response.success && response.data) {
        const reply = response.data
        setMessages((prev) => [...prev, {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply.message,
          timestamp: new Date().toISOString(),
        }])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setIsSending(false)
    }
  }, [])

  const clearHistory = useCallback(async () => {
    await chatService.clearHistory()
    const response = await chatService.getMessages()
    if (response.success) {
      setMessages(response.data)
    }
  }, [])

  return {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    clearHistory,
  }
}
