import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-success-100 text-success-700";
    case "scheduled":
      return "bg-primary-100 text-primary-700";
    case "in-progress":
      return "bg-warning-100 text-warning-700";
    case "cancelled":
      return "bg-danger-100 text-danger-700";
    case "no-show":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function getAlertColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case "urgent":
      return "border-l-danger-500 bg-danger-50";
    case "high":
      return "border-l-warning-500 bg-warning-50";
    case "medium":
      return "border-l-primary-500 bg-primary-50";
    case "low":
      return "border-l-gray-400 bg-gray-50";
    default:
      return "border-l-gray-400 bg-gray-50";
  }
}
