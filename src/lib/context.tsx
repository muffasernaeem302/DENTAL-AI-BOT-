"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Appointment, Alert, FollowUpTask, AlertNote } from "./types";
import { mockAppointments } from "./appointments";
import { mockAlerts } from "./alerts";
import { mockFollowUpTasks } from "./tasks";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface AppContextType {
  appointments: Appointment[];
  alerts: Alert[];
  followUpTasks: FollowUpTask[];
  toasts: Toast[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  updateAppointmentStatus: (appointmentId: string, status: Appointment["status"]) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  addAlertNote: (alertId: string, note: string) => void;
  updateTaskStatus: (taskId: string, status: FollowUpTask["status"]) => void;
  addToast: (message: string, type: Toast["type"]) => void;
  removeToast: (id: string) => void;
  getAppointmentById: (id: string) => Appointment | undefined;
  getPatientAppointments: (patientId: string) => Appointment[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [followUpTasks, setFollowUpTasks] = useState<FollowUpTask[]>(mockFollowUpTasks);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loading, setLoading] = useState(false);

  const addToast = useCallback((message: string, type: Toast["type"]) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateAppointmentStatus = useCallback(
    (appointmentId: string, status: Appointment["status"]) => {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status } : apt
        )
      );
      addToast(`Appointment status updated to ${status}`, "success");
    },
    [addToast]
  );

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
    addToast("Alert acknowledged", "info");
  }, [addToast]);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, resolved: true, resolvedAt: new Date() }
          : alert
      )
    );
    addToast("Alert resolved", "success");
  }, [addToast]);

  const addAlertNote = useCallback((alertId: string, noteText: string) => {
    const newNote: AlertNote = {
      id: `note-${Date.now()}`,
      text: noteText,
      author: "Dr. Smith",
      createdAt: new Date(),
    };
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, notes: [...alert.notes, newNote] }
          : alert
      )
    );
    addToast("Note added", "info");
  }, [addToast]);

  const updateTaskStatus = useCallback(
    (taskId: string, status: FollowUpTask["status"]) => {
      setFollowUpTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status } : task
        )
      );
      addToast(`Task marked as ${status}`, "success");
    },
    [addToast]
  );

  const getAppointmentById = useCallback(
    (id: string) => appointments.find((apt) => apt.id === id),
    [appointments]
  );

  const getPatientAppointments = useCallback(
    (patientId: string) =>
      appointments.filter((apt) => apt.patientId === patientId),
    [appointments]
  );

  return (
    <AppContext.Provider
      value={{
        appointments,
        alerts,
        followUpTasks,
        toasts,
        loading,
        setLoading,
        updateAppointmentStatus,
        acknowledgeAlert,
        resolveAlert,
        addAlertNote,
        updateTaskStatus,
        addToast,
        removeToast,
        getAppointmentById,
        getPatientAppointments,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
