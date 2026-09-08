"use client";

import { PatientIntake } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntakeCardProps {
  intake: PatientIntake;
}

export function IntakeCard({ intake }: IntakeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Patient-Reported Intake
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Chief Concern</p>
              <p className="text-base font-medium text-gray-900">{intake.patientConcern}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="text-base text-gray-900">{intake.duration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pain Level</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      intake.painLevel >= 7 ? "bg-danger-500" : intake.painLevel >= 4 ? "bg-warning-500" : "bg-success-500"
                    )}
                    style={{ width: `${(intake.painLevel / 10) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{intake.painLevel}/10</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Other Information</p>
              <p className="text-sm text-gray-900">{intake.otherInformation}</p>
            </div>
            {intake.symptoms.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Reported Symptoms</p>
                <div className="flex flex-wrap gap-2">
                  {intake.symptoms.map((s) => (
                    <Badge key={s} variant="default">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
            {intake.medications.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Current Medications</p>
                <div className="flex flex-wrap gap-2">
                  {intake.medications.map((m) => (
                    <Badge key={m} variant="secondary">{m}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
