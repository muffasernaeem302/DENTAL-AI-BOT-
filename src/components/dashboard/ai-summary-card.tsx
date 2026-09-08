"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface AISummaryCardProps {
  summary: string;
}

export function AISummaryCard({ summary }: AISummaryCardProps) {
  return (
    <Card className="border-primary-200 bg-primary-50">
      <CardHeader className="bg-primary-100/50">
        <CardTitle className="flex items-center gap-2 text-primary-800">
          <Activity className="h-5 w-5" />
          AI-Generated Administrative Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
        <p className="text-xs text-gray-500 mt-4 italic">
          AI-generated summary based on patient-provided information. Not a diagnosis.
        </p>
      </CardContent>
    </Card>
  );
}
