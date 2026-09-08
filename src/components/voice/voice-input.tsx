// Voice Input Component
"use client";
import { useVoice } from "@/lib/voice-context";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function VoiceInput() {
  const { recordingState, startRecording, stopRecording, isVoiceAvailable, t, transcription, transcriptionError } = useVoice();

  if (!isVoiceAvailable) {
    return null;
  }

  const isRecording = recordingState === "recording";
  const isProcessing = recordingState === "processing";
  const hasError = recordingState === "error" || transcriptionError;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <Button
          variant={isRecording ? "danger" : "primary"}
          size="lg"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={cn(
            "rounded-full w-14 h-14 flex items-center justify-center transition-all",
            isRecording && "animate-pulse bg-danger-600 hover:bg-danger-700"
          )}
        >
          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isRecording ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
        {isRecording && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 rounded-full animate-ping" />
        )}
      </div>
      <span className="text-xs text-gray-500">
        {isRecording ? t("voice.recording") : isProcessing ? t("voice.processing") : t("voice.record")}
      </span>
      {hasError && (
        <div className="flex items-center gap-1 text-xs text-danger-600">
          <AlertCircle className="h-3 w-3" />
          <span>{transcriptionError || t("voice.error")}</span>
        </div>
      )}
    </div>
  );
}
