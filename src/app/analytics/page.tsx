"use client";

import { useApp } from "@/lib/context";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Clock, TrendingUp } from "lucide-react";
import { mockPatients } from "@/lib/data";

export default function AnalyticsPage() {
  const { appointments } = useApp();
  const patients = mockPatients;
  const completedAppointments = appointments.filter((a) => a.status === "completed").length;
  const totalAppointments = appointments.length;
  const completionRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Clinic performance overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalAppointments}</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-full"><Calendar className="h-6 w-6 text-primary-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Patients</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{patients.length}</p>
              </div>
              <div className="p-3 bg-secondary-100 rounded-full"><Users className="h-6 w-6 text-secondary-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{completionRate}%</p>
              </div>
              <div className="p-3 bg-success-100 rounded-full"><TrendingUp className="h-6 w-6 text-success-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg per Day</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{Math.round(totalAppointments / 7)}</p>
              </div>
              <div className="p-3 bg-warning-100 rounded-full"><Clock className="h-6 w-6 text-warning-600" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Appointment Types Distribution</h3>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            {["Routine Checkup", "Teeth Cleaning", "Emergency Visit", "Root Canal", "Extraction"].map((type) => {
              const count = appointments.filter((a) => a.type === type).length;
              const percentage = totalAppointments > 0 ? Math.round((count / totalAppointments) * 100) : 0;
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{type}</span>
                    <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
