"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { Appointment } from "@/lib/types";
import { formatTime, formatDate, getStatusColor } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Eye, Plus, Calendar, Search } from "lucide-react";
import { PatientDetail } from "@/components/dashboard/patient-detail";

export default function AppointmentsPage() {
  const { appointments } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const filtered = appointments.filter((apt) =>
    searchQuery === "" || apt.patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <Button variant="primary"><Plus className="h-4 w-4 mr-2" />New</Button>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search patients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((apt) => (
                <tr key={apt.id} className="table-row-hover">
                  <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{apt.patient.name}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{formatDate(apt.dateTime)}</div><div className="text-xs text-gray-500">{formatTime(apt.dateTime)}</div></td>
                  <td className="px-6 py-4 text-sm text-gray-900">{apt.type}</td>
                  <td className="px-6 py-4"><Badge className={getStatusColor(apt.status)}>{apt.status}</Badge></td>
                  <td className="px-6 py-4"><Button variant="ghost" size="sm" onClick={() => { setSelectedAppointment(apt); setShowDetail(true); }}><Eye className="h-4 w-4 mr-1" />View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Dialog open={showDetail} onClose={() => setShowDetail(false)} title="Patient Detail" className="max-w-4xl">
        {selectedAppointment && <PatientDetail appointment={selectedAppointment} onClose={() => setShowDetail(false)} />}
      </Dialog>
    </div>
  );
}
