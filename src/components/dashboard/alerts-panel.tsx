"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { Alert } from "@/lib/types";
import { getAlertColor, formatDateTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Check, User, Clock, AlertTriangle } from "lucide-react";
import { AlertDetailDialog } from "./alert-detail-dialog";

export function AlertsPanel() {
  const { alerts, acknowledgeAlert, resolveAlert } = useApp();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const activeAlerts = alerts.filter((a) => !a.resolved);

  const handleViewDetail = (alert: Alert) => {
    setSelectedAlert(alert);
    setShowDetail(true);
  };

  const handleAcknowledge = (e: React.MouseEvent, alertId: string) => {
    e.stopPropagation();
    acknowledgeAlert(alertId);
  };

  const handleResolve = (e: React.MouseEvent, alertId: string) => {
    e.stopPropagation();
    resolveAlert(alertId);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-danger-600" />
            Patient Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {activeAlerts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Check className="h-12 w-12 mx-auto mb-2 text-success-500" />
              <p>All alerts are resolved!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => handleViewDetail(alert)}
                  className={`p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${getAlertColor(alert.priority)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                        <Badge variant={alert.priority === "urgent" ? "danger" : alert.priority === "high" ? "warning" : "default"}>
                          {alert.priority}
                        </Badge>
                        {!alert.acknowledged && <span className="h-2 w-2 rounded-full bg-danger-500" />}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {alert.patient.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(alert.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!alert.acknowledged && (
                        <Button variant="outline" size="sm" onClick={(e) => handleAcknowledge(e, alert.id)}>
                          Acknowledge
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={(e) => handleResolve(e, alert.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDetailDialog
        alert={selectedAlert}
        open={showDetail}
        onClose={() => setShowDetail(false)}
      />
    </>
  );
}
