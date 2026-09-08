// Text-to-Speech API Route - SECURED
import { NextRequest, NextResponse } from "next/server";
import { validateLength, badRequest, tooMany, serverError } from "@/lib/api-middleware";

const voiceRateLimit = new Map<string, { count: number; resetAt: number }>();

function checkVoiceRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = voiceRateLimit.get(ip);
  const limit = 30;
  const window = 60000;

  if (!record || record.resetAt < now) {
    voiceRateLimit.set(ip, { count: 1, resetAt: now + window });
    return true;
  }

  if (record.count >= limit) return false;
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkVoiceRateLimit(ip)) return tooMany(60);

    const body = await request.json();
    const { text, language, voice } = body;

    if (!text) return badRequest("Text is required");

    const safeText = validateLength(text, 1, 5000, "text");
    const safeLanguage = language ? validateLength(language, 2, 10, "language") : "en-US";
    const safeVoice = voice ? validateLength(voice, 1, 50, "voice") : "default";

    const allowedLanguages = ["en-US", "en-GB", "ur-PK", "ro-UR"];
    if (!allowedLanguages.includes(safeLanguage)) return badRequest("Unsupported language");

    console.log(`[Voice API] Synthesis request - lang: ${safeLanguage}, voice: ${safeVoice}, textLen: ${safeText.length}`);

    return NextResponse.json({
      success: true,
      message: "Mock synthesis - configure API keys for real TTS",
      audioUrl: null,
    });
  } catch (error) {
    console.error("[Voice API] Synthesis error:", error);
    return serverError();
  }
}
 
