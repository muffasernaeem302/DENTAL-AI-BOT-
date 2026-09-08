"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { Search, Bell, User, ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function TopNav() {
  const { alerts } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);
  const urgentAlerts = unacknowledgedAlerts.filter(
    (a) => a.priority === "urgent" || a.priority === "high"
  );

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <Bell className="h-5 w-5" />
              {urgentAlerts.length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-danger-500 rounded-full text-[10px] font-medium text-white flex items-center justify-center">
                  {urgentAlerts.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <>
                <div className="fixed inset-0" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <p className="text-xs text-gray-500">{unacknowledgedAlerts.length} unread</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {urgentAlerts.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500 text-sm">No new notifications</div>
                    ) : (
                      urgentAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={cn(
                            "px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer border-l-4",
                            alert.priority === "urgent" ? "border-l-danger-500" : "border-l-warning-500"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                            <Badge variant={alert.priority === "urgent" ? "danger" : "warning"}>
                              {alert.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{alert.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{alert.patient.name}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <Link href="/alerts" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      View all notifications
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-4 w-4 text-primary-700" />
            </div>
            <span className="text-sm font-medium text-gray-700">Dr. Smith</span>
          </div>
        </div>
      </div>
    </header>
  );
}
