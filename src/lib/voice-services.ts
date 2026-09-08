// Voice Services - Abstracted STT and TTS Providers
export type VoiceProvider = "browser" | "openai" | "google" | "azure";

export interface TranscriptionResult {
  text: string;
  language?: string;
  confidence?: number;
}

export interface SynthesisOptions {
  text: string;
  language?: string;
  voice?: string;
  rate?: number;
  pitch?: number;
}

export interface STTService {
  readonly provider: VoiceProvider;
  transcribe(audioData: ArrayBuffer, options?: { language?: string }): Promise<TranscriptionResult>;
  isAvailable(): boolean;
}

export interface TTSService {
  readonly provider: VoiceProvider;
  speak(text: string, options?: SynthesisOptions): Promise<void>;
  stop(): void;
  isAvailable(): boolean;
}

export class BrowserSTT implements STTService {
  readonly provider: VoiceProvider = "browser";
  private recognition: any = null;

  constructor() {
    if (typeof window !== "undefined" && ("SpeechRecognition" in (window as any) || "webkitSpeechRecognition" in (window as any))) {
      const SRClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SRClass();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
    }
  }

  async transcribe(_audioData: ArrayBuffer, options?: { language?: string }): Promise<TranscriptionResult> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) { reject(new Error("Speech recognition not available")); return; }
      if (options?.language) this.recognition.lang = options.language;
      this.recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        resolve({ text: result[0].transcript, confidence: result[0].confidence, language: this.recognition?.lang });
      };
      this.recognition.onerror = (event: any) => reject(new Error(`Speech error: ${event.error}`));
      this.recognition.onend = () => {};
      this.recognition.start();
      setTimeout(() => { if (this.recognition) this.recognition.stop(); }, 30000);
    });
  }

  isAvailable(): boolean { return this.recognition !== null; }
}

export class BrowserTTS implements TTSService {
  readonly provider: VoiceProvider = "browser";

  async speak(text: string, options?: SynthesisOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.speechSynthesis) { reject(new Error("Speech synthesis not available")); return; }
      const utterance = new SpeechSynthesisUtterance(text);
      if (options?.language) utterance.lang = options.language;
      if (options?.rate) utterance.rate = options.rate;
      if (options?.pitch) utterance.pitch = options.pitch;
      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);
      window.speechSynthesis.speak(utterance);
    });
  }

  stop(): void { if (typeof window !== "undefined") window.speechSynthesis.cancel(); }
  isAvailable(): boolean { return typeof window !== "undefined" && "speechSynthesis" in window; }
}

export function createSTTService(_provider: VoiceProvider = "browser"): STTService { return new BrowserSTT(); }
export function createTTSService(_provider: VoiceProvider = "browser"): TTSService { return new BrowserTTS(); }

export const STT_LANGUAGE_MAP: Record<string, string> = { en: "en-US", ur: "ur-PK", ru: "ur-PK" };
export const TTS_LANGUAGE_MAP: Record<string, string> = { en: "en-US", ur: "ur-PK", ru: "en-US" };
export function getSTTLang(code: string): string { return STT_LANGUAGE_MAP[code] || "en-US"; }
export function getTTSLang(code: string): string { return TTS_LANGUAGE_MAP[code] || "en-US"; }
