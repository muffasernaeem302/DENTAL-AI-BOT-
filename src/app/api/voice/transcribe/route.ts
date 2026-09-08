// Speech-to-Text API Route - SECURED
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
    const { audio, language, format } = body;

    if (!audio) return badRequest("Audio data is required");

    const safeLanguage = language ? validateLength(language, 2, 10, "language") : "en-US";
    const allowedLanguages = ["en-US", "en-GB", "ur-PK", "ro-UR"];
    if (!allowedLanguages.includes(safeLanguage)) return badRequest("Unsupported language");

    const safeFormat = format ? validateLength(format, 1, 20, "format") : "webm";
    const audioSize = Buffer.from(audio).length;
    if (audioSize > 10 * 1024 * 1024) return badRequest("Audio file too large (max 10MB)");

    console.log(`[Voice API] Transcription request - lang: ${safeLanguage}, format: ${safeFormat}`);

    return NextResponse.json({
      success: true,
      transcription: "Voice input received (mock)",
      language: safeLanguage,
      confidence: 0.95,
    });
  } catch (error) {
    console.error("[Voice API] Transcription error:", error);
    return serverError();
  }
}
 
