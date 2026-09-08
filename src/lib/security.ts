// Security Configuration and Utilities
// Central security configuration for DentalAI

// Security headers configuration
export const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(self), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://api.openai.com https://api.anthropic.com",
    "frame-ancestors 'none'",
  ].join("; "),
};

// Rate limiting configuration
export const RATE_LIMITS = {
  // Requests per window (window in minutes)
  api: { limit: 100, window: 1 },
  auth: { limit: 5, window: 5 },
  voice: { limit: 50, window: 1 },
  followup: { limit: 30, window: 1 },
};

// Session configuration
export const SESSION_CONFIG = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "strict",
};

// Input sanitization patterns
export const SANITIZATION_PATTERNS = {
  // SQL injection prevention patterns (for logging/monitoring)
  sqlInjection: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE)\b)/gi,
  // XSS prevention patterns
  xssPatterns: /<script|javascript:|on\w+=|document\.|window\./gi,
  // Path traversal prevention
  pathTraversal: /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\/|\.\.%2f)/gi,
  // Email validation (RFC 5322 simplified)
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  // Phone validation (international)
  phone: /^\+?[1-9]\d{1,14}$/,
};

// Maximum input lengths
export const INPUT_LIMITS = {
  name: 100,
  email: 255,
  phone: 20,
  message: 5000,
  notes: 2000,
  search: 100,
};

// Validate and sanitize string input
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (typeof input !== "string") return "";
  return input
    .slice(0, maxLength)
    .replace(/[<>]/g, "") // Remove < and >
    .trim();
}

// Validate email
export function isValidEmail(email: string): boolean {
  return SANITIZATION_PATTERNS.email.test(email);
}

// Validate phone
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return SANITIZATION_PATTERNS.phone.test(cleaned);
}

// Check for suspicious patterns
export function detectSuspiciousInput(input: string): boolean {
  const patterns = [
    SANITIZATION_PATTERNS.sqlInjection,
    SANITIZATION_PATTERNS.xssPatterns,
    SANITIZATION_PATTERNS.pathTraversal,
  ];
  return patterns.some((pattern) => pattern.test(input));
}

// Safe JSON parse with error handling
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join("");
}

// Hash sensitive data for logging (not reversible)
export function hashForLogging(data: string): string {
  // Simple hash for demo - use proper crypto in production
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// Mask sensitive data for logging
export function maskSensitiveData(data: string, type: "email" | "phone" | "ssn" | "card"): string {
  switch (type) {
    case "email":
      const [local, domain] = data.split("@");
      if (!domain) return "***@***";
      return `${local.slice(0, 2)}***@${domain}`;
    case "phone":
      return data.slice(-4).padStart(data.length, "*");
    case "ssn":
      return "***-**-" + data.slice(-4);
    case "card":
      return "****-****-****-" + data.slice(-4);
    default:
      return "***";
  }
}

// Log levels for audit trail
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SECURITY = 4,
}

// Audit event types
export enum AuditEvent {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILED = "LOGIN_FAILED",
  LOGOUT = "LOGOUT",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS",
  RESOURCE_ACCESS = "RESOURCE_ACCESS",
  RESOURCE_MODIFY = "RESOURCE_MODIFY",
  DATA_EXPORT = "DATA_EXPORT",
  SENSITIVE_ACTION = "SENSITIVE_ACTION",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  SUSPICIOUS_INPUT = "SUSPICIOUS_INPUT",
}

// Audit log entry structure
export interface AuditLogEntry {
  timestamp: string;
  level: LogLevel;
  event: AuditEvent;
  userId?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
  action?: string;
  success: boolean;
  details?: Record<string, unknown>;
  // Do NOT log: patient name, patient ID, diagnosis, treatment details
}

// Create audit log entry (sanitized)
export function createAuditLog(
  event: AuditEvent,
  success: boolean,
  details: Partial<AuditLogEntry> = {}
): AuditLogEntry {
  return {
    timestamp: new Date().toISOString(),
    level: success ? LogLevel.INFO : LogLevel.WARN,
    event,
    success,
    ...details,
  };
}
