// Voice Assistant Page
"use client";
import { VoiceChat } from "@/components/voice/voice-chat";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Shield } from "lucide-react";

export default function AssistantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Voice Assistant</h1>
        <p className="text-sm text-gray-500 mt-1">Chat with DentalAI using voice or text in English, Urdu, or Roman Urdu</p>
      </div>
      <VoiceChat />
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-success-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Privacy Note</p>
              <p className="text-xs text-gray-500 mt-1">
                Voice input uses browser-native speech recognition. Audio is processed locally and not stored on servers. 
                The assistant can help with scheduling and general inquiries but does not provide medical diagnoses.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
