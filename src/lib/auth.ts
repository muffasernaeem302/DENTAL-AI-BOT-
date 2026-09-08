// Authentication and Authorization Types
export type UserRole = "admin" | "dentist" | "receptionist" | "patient";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  clinicId?: string;
  patientId?: string;
  createdAt: Date;
  lastLogin?: Date;
  failedLoginAttempts: number;
  lockedUntil?: Date;
}

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
}

export type Permission =
  | "view:all:patients" | "edit:all:patients" | "delete:patient"
  | "view:own:patients" | "edit:own:patients"
  | "view:assigned:patients" | "edit:assigned:patients"
  | "view:clinic:patients" | "create:patient" | "edit:patient:basic"
  | "view:all:appointments" | "edit:all:appointments" | "delete:appointment"
  | "view:clinic:appointments" | "create:appointment" | "edit:appointment" | "edit:clinic:appointments"
  | "view:own:appointments"
  | "view:all:alerts" | "edit:all:alerts" | "view:clinic:alerts" | "edit:alert:status"
  | "view:own:alerts"
  | "view:all:followups" | "edit:all:followups" | "view:clinic:followups" | "edit:followup:status"
  | "view:all:tasks" | "edit:all:tasks" | "view:clinic:tasks" | "edit:clinic:tasks" | "edit:task:status"
  | "manage:users" | "manage:settings"
  | "view:analytics" | "view:basic:analytics"
  | "view:audit" | "export:data" | "export:own:data"
  | "system:config"
  | "view:own:profile" | "edit:own:profile"
  | "view:own:records";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    "view:all:patients", "edit:all:patients", "delete:patient",
    "view:all:appointments", "edit:all:appointments", "delete:appointment",
    "view:all:alerts", "edit:all:alerts",
    "view:all:followups", "edit:all:followups",
    "view:all:tasks", "edit:all:tasks",
    "manage:users", "manage:settings",
    "view:analytics", "view:audit", "export:data", "system:config",
  ],
  dentist: [
    "view:own:patients", "edit:own:patients",
    "view:assigned:patients", "edit:assigned:patients",
    "view:clinic:appointments", "edit:clinic:appointments",
    "view:all:alerts", "edit:all:alerts",
    "view:all:followups", "edit:all:followups",
    "view:clinic:tasks", "edit:clinic:tasks",
    "view:analytics", "create:patient", "export:own:data",
  ],
  receptionist: [
    "view:clinic:patients", "create:patient", "edit:patient:basic",
    "view:clinic:appointments", "create:appointment", "edit:appointment",
    "view:clinic:alerts", "edit:alert:status",
    "view:clinic:followups", "edit:followup:status",
    "view:clinic:tasks", "edit:task:status",
    "view:basic:analytics",
  ],
  patient: [
    "view:own:profile", "edit:own:profile",
    "view:own:appointments",
    "view:own:alerts",
    "view:own:records",
  ],
};

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
}

export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.some((p) => hasPermission(user, p));
}

export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.every((p) => hasPermission(user, p));
}

export function canAccessPatient(user: User | null, patientId: string): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role === "dentist") return true;
  if (user.role === "receptionist") return true;
  if (user.role === "patient") return user.patientId === patientId;
  return false;
}

export class AuthorizationError extends Error {
  constructor(message: string, public readonly requiredPermission?: Permission, public readonly resourceId?: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}
