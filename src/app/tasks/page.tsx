"use client";

import { TasksPanel } from "@/components/dashboard/tasks-panel";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <p className="text-sm text-gray-500 mt-1">Follow-up tasks and reminders</p>
      </div>
      <TasksPanel />
    </div>
  );
}
