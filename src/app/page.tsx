"use client";

import { useApp } from "@/lib/context";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { AppointmentTable } from "@/components/dashboard/appointment-table";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { TasksPanel } from "@/components/dashboard/tasks-panel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatTime } from "@/lib/utils";
import { Calendar, Clock, Activity } from "lucide-react";

export default function DashboardPage() {
  const { appointments } = useApp();

  const now = new Date();
  const todayAppointments = appointments
    .filter((apt) => {
      const aptDate = new Date(apt.dateTime);
      return (
        aptDate.toDateString() === now.toDateString() &&
        (apt.status === "scheduled" || apt.status === "in-progress")
      );
    })
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const upcomingAppointments = appointments
    .filter((apt) => {
      const aptDate = new Date(apt.dateTime);
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return aptDate > now && aptDate.toDateString() !== now.toDateString() && apt.status === "scheduled";
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, Dr. Smith. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Appointments Table */}
        <div className="lg:col-span-2">
          <AppointmentTable />
        </div>

        {/* Right Column - Alerts & Tasks */}
        <div className="space-y-6">
          <AlertsPanel />
          <TasksPanel />
        </div>
      </div>

      {/* Quick Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-600" />
              Today&apos;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No appointments scheduled for today</p>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {formatTime(apt.dateTime)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{apt.patient.name}</p>
                      <p className="text-xs text-gray-500">{apt.type}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        apt.status === "in-progress"
                          ? "bg-warning-100 text-warning-700"
                          : "bg-primary-100 text-primary-700"
                      }`}
                    >
                      {apt.status === "in-progress" ? "In Progress" : "Scheduled"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-secondary-600" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No upcoming appointments</p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(apt.dateTime).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{apt.patient.name}</p>
                      <p className="text-xs text-gray-500">{apt.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
