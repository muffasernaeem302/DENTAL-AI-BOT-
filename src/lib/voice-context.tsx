// Voice Context - State management for voice features
"use client";
import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from "react";
import { Language, t } from "./i18n-config";
import { createSTTService, createTTSService, getSTTLang, getTTSLang } from "./voice-services";

export type RecordingState = "idle" | "recording" | "processing" | "error";

interface VoiceContextType {
  language: Language; setLanguage: (lang: Language) => void; t: (key: string) => string;
  recordingState: RecordingState; startRecording: () => Promise<void>; stopRecording: () => void;
  transcription: string; transcriptionError: string | null;
  isSpeaking: boolean; speak: (text: string) => Promise<void>; stopSpeaking: () => void;
  lastAudioUrl: string | null; isVoiceAvailable: boolean; resetVoice: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [transcription, setTranscription] = useState("");
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastAudioUrl, setLastAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const sttRef = useRef<any>(null);
  const ttsRef = useRef<any>(null);

  useEffect(() => { sttRef.current = createSTTService("browser"); ttsRef.current = createTTSService("browser"); }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") localStorage.setItem("dentalai_language", lang);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dentalai_language") as Language | null;
      if (saved) setLanguageState(saved);
    }
  }, []);

  const translate = useCallback((key: string) => t(key, language), [language]);
  const isVoiceAvailable = typeof window !== "undefined" && (("SpeechRecognition" in window || "webkitSpeechRecognition" in window) || "speechSynthesis" in window);

  const startRecording = useCallback(async () => {
    if (recordingState === "recording") return;
    try {
      setTranscriptionError(null); setTranscription(""); setRecordingState("recording"); audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream); mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = async () => {
        setRecordingState("processing");
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        try {
          if (sttRef.current) {
            const result = await sttRef.current.transcribe(await blob.arrayBuffer(), { language: getSTTLang(language) });
            setTranscription(result.text || "");
          }
        } catch { setTranscriptionError(t("voice.error", language)); }
        setRecordingState("idle"); stream.getTracks().forEach((tr) => tr.stop());
      };
      mr.start(); setTimeout(() => { if (mediaRecorderRef.current?.state === "recording") stopRecording(); }, 30000);
    } catch { setRecordingState("error"); setTranscriptionError(t("voice.notAvailable", language)); }
  }, [language, recordingState]);

  const stopRecording = useCallback(() => { if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop(); setRecordingState("idle"); }, []);

  const speak = useCallback(async (text: string) => {
    if (!ttsRef.current) return;
    try { setIsSpeaking(true); ttsRef.current.stop(); await ttsRef.current.speak(text, { language: getTTSLang(language) }); } catch {} finally { setIsSpeaking(false); }
  }, [language]);

  const stopSpeaking = useCallback(() => { if (ttsRef.current) ttsRef.current.stop(); setIsSpeaking(false); }, []);
  const resetVoice = useCallback(() => { setTranscription(""); setTranscriptionError(null); setRecordingState("idle"); setLastAudioUrl(null); }, []);

  return <VoiceContext.Provider value={{ language, setLanguage, t: translate, recordingState, startRecording, stopRecording, transcription, transcriptionError, isSpeaking, speak, stopSpeaking, lastAudioUrl, isVoiceAvailable, resetVoice }}>{children}</VoiceContext.Provider>;
}

export function useVoice() { const ctx = useContext(VoiceContext); if (!ctx) throw new Error("useVoice must be used within VoiceProvider"); return ctx; }
