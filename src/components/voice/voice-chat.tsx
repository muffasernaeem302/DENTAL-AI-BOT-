// Voice Chat Component
"use client";
import { useState, useRef, useEffect } from "react";
import { useVoice } from "@/lib/voice-context";
import { VoiceInput } from "./voice-input";
import { LanguageSelector } from "./language-selector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Volume2, VolumeX, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message { id: string; role: "user" | "assistant"; content: string; timestamp: Date; }

export function VoiceChat() {
  const { language, t, transcription, speak, isSpeaking } = useVoice();
  const [messages, setMessages] = useState<Message[]>([{ id: "1", role: "assistant", content: t("chat.welcome"), timestamp: new Date() }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (transcription) setInput(transcription); }, [transcription]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim(), timestamp: new Date() };
    setMessages((p) => [...p, userMsg]); setInput(""); setLoading(true);
    setTimeout(() => {
      const responses: Record<string, string[]> = {
        en: ["I can help schedule an appointment. What time works best?", "Based on your concern, I recommend a checkup. Shall I book one?", "We have several slots this week. Should I check the dentist's schedule?"],
        ur: ["میں اپائنٹمنٹ شیڈول کر سکتا ہوں۔ کون سا وقت بہتر ہے؟", "چیک اپ شیڈول کرنے کی سفارش کرتا ہوں۔ کیا بک کروانا چاہیں گے؟"],
        ru: ["Main appointment schedule kar sakta hoon. Kaunsa time better hai?", "Main checkup recommend karta hoon. Book karein?"],
      };
      const resp = (responses[language] || responses.en)[Math.floor(Math.random() * (responses[language] || responses.en).length)];
      setMessages((p) => [...p, { id: (Date.now() + 1).toString(), role: "assistant", content: resp, timestamp: new Date() }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg"><Bot className="h-6 w-6 text-primary-600" /></div>
          <div><h2 className="font-semibold">DentalAI Assistant</h2><p className="text-xs text-gray-500">{language.toUpperCase()}</p></div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => speak(messages[messages.length - 1]?.content || "")} className={cn(isSpeaking && "text-primary-600")}>
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <LanguageSelector />
        </div>
      </div>

      {/* Messages */}
      <Card className="flex-1 overflow-y-auto p-4 rounded-none border-x-0">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "assistant" && <div className="p-2 bg-primary-100 rounded-full h-8 w-8 flex items-center justify-center"><Bot className="h-4 w-4 text-primary-600" /></div>}
              <div className={cn("max-w-[70%] rounded-xl px-4 py-2", msg.role === "user" ? "bg-primary-600 text-white" : "bg-gray-100")}>
                <p className="text-sm">{msg.content}</p>
              </div>
              {msg.role === "user" && <div className="p-2 bg-primary-100 rounded-full h-8 w-8 flex items-center justify-center"><User className="h-4 w-4 text-primary-600" /></div>}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="p-2 bg-primary-100 rounded-full h-8 w-8 flex items-center justify-center"><Bot className="h-4 w-4 text-primary-600" /></div>
              <div className="bg-gray-100 rounded-xl px-4 py-3 flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </Card>

      {/* Transcription */}
      {transcription && <div className="px-4 py-2 bg-primary-50 border-x border-gray-200 text-sm text-primary-700"><span className="font-medium">Transcription:</span> {transcription}</div>}

      {/* Input */}
      <div className="p-4 border-t bg-white rounded-b-xl">
        <div className="flex items-end gap-3">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={t("chat.placeholder")} rows={1} className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" style={{ minHeight: "48px" }} />
          <VoiceInput />
          <Button variant="primary" onClick={send} disabled={!input.trim() || loading} className="h-12 w-12 rounded-xl flex items-center justify-center">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
