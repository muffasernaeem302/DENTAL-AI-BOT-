// Internationalization Configuration
// Language support for English, Urdu, and Roman Urdu

export type Language = "en" | "ur" | "ru";

export const LANGUAGES: { code: Language; name: string; nativeName: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "ur", name: "Urdu", nativeName: "اردو", dir: "rtl" },
  { code: "ru", name: "Roman Urdu", nativeName: "Roman Urdu", dir: "ltr" },
];

export function getLanguage(code: string): typeof LANGUAGES[0] {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}

// Translation strings for UI
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // General
    "app.name": "DentalAI",
    "app.tagline": "AI-Powered Dental Clinic",
    "nav.dashboard": "Dashboard",
    "nav.appointments": "Appointments",
    "nav.patients": "Patients",
    "nav.alerts": "Alerts",
    "nav.followup": "Follow-ups",
    "nav.tasks": "Tasks",
    "nav.settings": "Settings",
    // Voice
    "voice.record": "Record",
    "voice.recording": "Recording...",
    "voice.stop": "Stop",
    "voice.play": "Play",
    "voice.send": "Send",
    "voice.listening": "Listening...",
    "voice.notAvailable": "Voice input isn't available right now. You can continue by typing.",
    "voice.transcription": "Transcription",
    "voice.processing": "Processing...",
    "voice.error": "Voice processing failed. Please try again or type your message.",
    "voice.retry": "Try Again",
    // Language
    "language.select": "Select Language",
    "language.current": "Current Language",
    // Chat
    "chat.placeholder": "Type your message or tap microphone to speak...",
    "chat.send": "Send",
    "chat.welcome": "Welcome! How can I help you today?",
    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.save": "Save",
    "common.close": "Close",
    "common.back": "Back",
  },
  ur: {
    // General
    "app.name": "ڈینٹل اے آئی",
    "app.tagline": "اے آئی سے چلنے والا دندان ساز کلینک",
    "nav.dashboard": "ڈیش بورڈ",
    "nav.appointments": "اپائنٹمنٹس",
    "nav.patients": "مریض",
    "nav.alerts": "انتباہات",
    "nav.followup": "فالو اپ",
    "nav.tasks": "ٹاسکس",
    "nav.settings": "سیٹنگز",
    // Voice
    "voice.record": "ریکارڈ کریں",
    "voice.recording": "ریکارڈنگ...",
    "voice.stop": "روکیں",
    "voice.play": "چلائیں",
    "voice.send": "بھیجیں",
    "voice.listening": "سن رہے ہیں...",
    "voice.notAvailable": "ووئس ان پٹ اب دستیاب نہیں ہے۔ آپ ٹائپ کرکے جاری رکھ سکتے ہیں۔",
    "voice.transcription": "ٹرانسکرپشن",
    "voice.processing": "پروسیسنگ...",
    "voice.error": "ووئس پروسیسنگ ناکام۔ براہ کرم دوبارہ کوشش کریں یا اپنا پیغام ٹائپ کریں۔",
    "voice.retry": "دوبارہ کوشش کریں",
    // Language
    "language.select": "زبان منتخب کریں",
    "language.current": "موجودہ زبان",
    // Chat
    "chat.placeholder": "اپنا پیغام ٹائپ کریں یا مائیکروفون پر ٹیپ کرکے بات کریں...",
    "chat.send": "بھیجیں",
    "chat.welcome": "خوش آمدید! آج میں آپ کی کیا مدد کر سکتا ہوں؟",
    // Common
    "common.loading": "لوڈ ہو رہا ہے...",
    "common.error": "خرابی",
    "common.success": "کامیاب",
    "common.cancel": "منسوخ کریں",
    "common.confirm": "تصدیق کریں",
    "common.save": "محفوظ کریں",
    "common.close": "بند کریں",
    "common.back": "واپس",
  },
  ru: {
    // General
    "app.name": "ڈینٹل اے آئی",
    "app.tagline": "AI dental clinic",
    "nav.dashboard": "Dashboard",
    "nav.appointments": "Appointments",
    "nav.patients": "Patients",
    "nav.alerts": "Alerts",
    "nav.followup": "Follow-ups",
    "nav.tasks": "Tasks",
    "nav.settings": "Settings",
    // Voice
    "voice.record": "Record karain",
    "voice.recording": "Recording...",
    "voice.stop": "Rokain",
    "voice.play": "Chalain",
    "voice.send": "Bhejin",
    "voice.listening": "Sun rahay hain...",
    "voice.notAvailable": "Voice input ab available nahi hai. Aap type karke jaari rakh saktay hain.",
    "voice.transcription": "Transcription",
    "voice.processing": "Processing...",
    "voice.error": "Voice processing fail ho gaya. Barah kram dubara koshish karain ya message type karain.",
    "voice.retry": "Dubara koshish",
    // Language
    "language.select": "Zaban select karain",
    "language.current": "Mojooda zaban",
    // Chat
    "chat.placeholder": "Apna message type karain ya microphone per tap karke baat karain...",
    "chat.send": "Bhejin",
    "chat.welcome": "Khush amadid! Aaj main aapki kya madad kar sakta hoon?",
    // Common
    "common.loading": "Load ho raha hai...",
    "common.error": "Ghalati",
    "common.success": "Kamyaab",
    "common.cancel": "Mansookh karain",
    "common.confirm": "Tasdeeq karain",
    "common.save": "Mehsus karain",
    "common.close": "Band karain",
    "common.back": "Wapas",
  },
};

export function t(key: string, lang: Language = "en"): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}
