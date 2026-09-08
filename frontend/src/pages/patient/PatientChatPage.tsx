import { useState, useRef, useEffect } from 'react'
import { Card, Button, Spinner } from '@/components/ui'
import { Send, Trash2, AlertCircle } from 'lucide-react'
import { useChat } from '@/hooks'
import { formatTime } from '@/utils'

export function PatientChatPage() {
  const { messages, isLoading, isSending, error, sendMessage, clearHistory } = useChat()
  const [input, setInput] = useState('')
  const [fields, setFields] = useState({ concern: false, duration: false, pain: false })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSending) return
    setInput('')
    await sendMessage(input)
    updateProgress(input)
  }

  const updateProgress = (c: string) => {
    const l = c.toLowerCase()
    setFields(p => {
      const n = { ...p }
      if (!n.concern && /pain|hurt|tooth|ache/.test(l)) n.concern = true
      if (!n.duration && /day|week|month|ago/.test(l)) n.duration = true
      if (!n.pain && /\d/.test(l)) n.pain = true
      return n
    })
  }

  const done = Object.values(fields).filter(Boolean).length

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div><h1 className="text-xl font-bold">AI Assistant</h1><p className="text-sm text-neutral-600">Powered by DentalAI</p></div>
        <Button variant="ghost" size="sm" onClick={clearHistory}><Trash2 className="w-4 h-4" /> Clear</Button>
      </div>

      {done > 0 && (
        <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex justify-between mb-2"><span className="text-sm font-medium">Information collected:</span><span className="text-xs">{done}/3</span></div>
          <div className="flex gap-3 text-xs">
            {fields.concern ? <span className="text-primary-700">✓ Concern</span> : <span className="text-neutral-400">○ Concern</span>}
            {fields.duration ? <span className="text-primary-700">✓ Duration</span> : <span className="text-neutral-400">○ Duration</span>}
            {fields.pain ? <span className="text-primary-700">✓ Pain level</span> : <span className="text-neutral-400">○ Pain level</span>}
          </div>
        </div>
      )}

      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800"><strong>Note:</strong> This AI provides general info only, not medical advice.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? <div className="flex justify-center"><Spinner /></div> : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg px-4 py-3 ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-neutral-100'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-primary-200' : 'text-neutral-500'}`}>{formatTime(msg.timestamp)}</p>
                  </div>
                </div>
              ))}
              {isSending && <div className="flex justify-start"><div className="bg-neutral-100 rounded-lg px-4 py-3"><Spinner size="sm" /></div></div>}
              <div ref={messagesEndRef} />
            </>
          )}
          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about appointments, dental care, or your visit..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" disabled={isSending} />
            <Button type="submit" disabled={!input.trim() || isSending} isLoading={isSending}><Send className="w-4 h-4" /></Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
 
