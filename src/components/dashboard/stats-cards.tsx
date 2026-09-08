"use client";

import { useApp } from "@/lib/context";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Bell, ClipboardList } from "lucide-react";

export function StatsCards() {
  const { appointments, alerts, followUpTasks } = useApp();

  const todayAppointments = appointments.filter(
    (apt) => apt.status === "scheduled" || apt.status === "in-progress"
  ).length;

  const completedToday = appointments.filter(
    (apt) => apt.status === "completed"
  ).length;

  const urgentAlerts = alerts.filter(
    (a) => !a.resolved && (a.priority === "urgent" || a.priority === "high")
  ).length;

  const pendingTasks = followUpTasks.filter(
    (t) => t.status === "pending" || t.status === "in-progress"
  ).length;

  const stats = [
    {
      label: "Today's Appointments",
      value: todayAppointments,
      subtext: `${completedToday} completed`,
      icon: Calendar,
      color: "text-primary-600",
      bg: "bg-primary-100",
    },
    {
      label: "Active Patients",
      value: 6,
      subtext: "This week",
      icon: Users,
      color: "text-secondary-600",
      bg: "bg-secondary-100",
    },
    {
      label: "Urgent Alerts",
      value: urgentAlerts,
      subtext: "Require attention",
      icon: Bell,
      color: "text-danger-600",
      bg: "bg-danger-100",
    },
    {
      label: "Follow-up Tasks",
      value: pendingTasks,
      subtext: "Pending items",
      icon: ClipboardList,
      color: "text-warning-600",
      bg: "bg-warning-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
