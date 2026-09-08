"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { Appointment } from "@/lib/types";
import { formatTime, getStatusColor } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Eye, Check, Calendar, X } from "lucide-react";
import { PatientDetail } from "./patient-detail";
import { Select } from "@/components/ui/select";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "scheduled", label: "Scheduled" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no-show", label: "No Show" },
];

export function AppointmentTable() {
  const { appointments, updateAppointmentStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const filteredAppointments = appointments.filter(
    (apt) => statusFilter === "all" || apt.status === statusFilter
  );

  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetail(true);
  };

  const handleComplete = (appointmentId: string) => {
    updateAppointmentStatus(appointmentId, "completed");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Appointments</CardTitle>
          <div className="flex items-center gap-4">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Intake</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="table-row-hover">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{apt.patient.name}</div>
                        <div className="text-xs text-gray-500">{apt.patient.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatTime(apt.dateTime)}</div>
                      <div className="text-xs text-gray-500">to {formatTime(apt.endTime)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{apt.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(apt.status)}>
                        {apt.status.replace("-", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {apt.intake ? (
                        <Badge variant={apt.intake.painLevel >= 7 ? "danger" : apt.intake.painLevel >= 4 ? "warning" : "success"}>
                          Pain: {apt.intake.painLevel}/10
                        </Badge>
                      ) : (
                        <span className="text-xs text-gray-400">No intake</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(apt)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {apt.status === "in-progress" && (
                          <Button variant="primary" size="sm" onClick={() => handleComplete(apt.id)}>
                            <Check className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetail} onClose={() => setShowDetail(false)} title="Patient Detail" className="max-w-4xl">
        {selectedAppointment && (
          <PatientDetail appointment={selectedAppointment} onClose={() => setShowDetail(false)} />
        )}
      </Dialog>
    </>
  );
}
