"use client";
import { Appointment } from "@/lib/types";
import { formatDateTime, getStatusColor } from "@/lib/utils";
import { useApp } from "@/lib/context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, MapPin, Calendar, Shield, AlertTriangle, FileText, Activity } from "lucide-react";

interface PatientDetailProps {
  appointment: Appointment;
  onClose: () => void;
}

export function PatientDetail({ appointment, onClose }: PatientDetailProps) {
  const { getPatientAppointments } = useApp();
  const patient = appointment.patient;
  const intake = appointment.intake;
  const patientHistory = getPatientAppointments(patient.id);

  return (
    <div className="p-6 space-y-6">
      <PatientInfoCard patient={patient} />
      <AppointmentHistoryCard history={patientHistory} />
      {intake && (<><IntakeCard intake={intake} /><AISummaryCard summary={intake.aiGeneratedSummary} /></>)}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button variant="primary">Schedule Follow-up</Button>
      </div>
    </div>
  );
}

function PatientInfoCard({ patient }: { patient: Appointment["patient"] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Patient Information</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div><p className="text-sm text-gray-500">Full Name</p><p className="text-base font-medium text-gray-900">{patient.name}</p></div>
            <div className="flex items-center gap-2 text-gray-600"><Mail className="h-4 w-4" /><span className="text-sm">{patient.email}</span></div>
            <div className="flex items-center gap-2 text-gray-600"><Phone className="h-4 w-4" /><span className="text-sm">{patient.phone}</span></div>
          </div>
          <div className="space-y-4">
            <div><p className="text-sm text-gray-500">Date of Birth</p><p className="text-base font-medium text-gray-900">{patient.dateOfBirth}</p></div>
            <div className="flex items-start gap-2 text-gray-600"><MapPin className="h-4 w-4 mt-0.5" /><span className="text-sm">{patient.address}</span></div>
            {patient.insuranceProvider && (<div className="flex items-center gap-2 text-gray-600"><Shield className="h-4 w-4" /><span className="text-sm">{patient.insuranceProvider}</span></div>)}
          </div>
        </div>
        {patient.notes && (<div className="mt-4 p-3 bg-warning-50 rounded-lg border border-warning-200"><div className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-warning-600 mt-0.5" /><div><p className="text-sm font-medium text-warning-800">Patient Notes</p><p className="text-sm text-warning-700">{patient.notes}</p></div></div></div>)}
      </CardContent>
    </Card>
  );
}

function AppointmentHistoryCard({ history }: { history: Appointment[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Appointment History</CardTitle></CardHeader>
      <CardContent>
        {history.length === 0 ? (<p className="text-sm text-gray-500 text-center py-4">No appointment history</p>) : (
          <div className="space-y-3">{history.map((apt) => (
            <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div><p className="text-sm font-medium text-gray-900">{apt.type}</p><p className="text-xs text-gray-500">{formatDateTime(apt.dateTime)}</p></div>
              <Badge className={getStatusColor(apt.status)}>{apt.status.replace("-", " ")}</Badge>
            </div>
          ))}</div>
        )}
      </CardContent>
    </Card>
  );
}

function IntakeCard({ intake }: { intake: Appointment["intake"] }) {
  if (!intake) return null;
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Intake Information</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><p className="text-sm text-gray-500">Chief Concern</p><p className="text-sm font-medium">{intake.patientConcern}</p></div>
          <div><p className="text-sm text-gray-500">Duration</p><p className="text-sm font-medium">{intake.duration}</p></div>
          <div><p className="text-sm text-gray-500">Pain Level</p><p className="text-sm font-medium">{intake.painLevel}/10</p></div>
          <div><p className="text-sm text-gray-500">Symptoms</p><p className="text-sm font-medium">{intake.symptoms?.join(", ") || "None"}</p></div>
        </div>
        {intake.allergies && intake.allergies.length > 0 && (<div className="p-3 bg-danger-50 rounded-lg border border-danger-200"><p className="text-sm font-medium text-danger-700">Allergies: {intake.allergies.join(", ")}</p></div>)}
        <div className="mt-4"><p className="text-sm text-gray-500">Summary</p><p className="text-sm">{intake.conversationSummary}</p></div>
      </CardContent>
    </Card>
  );
}

function AISummaryCard({ summary }: { summary?: string }) {
  if (!summary) return null;
  return (
    <Card className="border-primary-200 bg-primary-50">
      <CardHeader><CardTitle className="flex items-center gap-2 text-primary-700"><Activity className="h-5 w-5" />AI Summary</CardTitle></CardHeader>
      <CardContent><p className="text-sm text-primary-900">{summary}</p></CardContent>
    </Card>
  );
}
