"use client";

import { AlertsPanel } from "@/components/dashboard/alerts-panel";

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor and manage patient alerts</p>
      </div>
      <AlertsPanel />
    </div>
  );
}
