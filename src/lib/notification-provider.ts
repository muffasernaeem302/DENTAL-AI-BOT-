// Notification Provider Interface and Mock Implementation
// Structured for easy addition of email/SMS/WhatsApp providers

import { NotificationChannel, NotificationLog, FollowUpOptOut } from "./followup-types";

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: Date;
}

export interface NotificationProvider {
  readonly channel: NotificationChannel;
  readonly name: string;
  send(recipient: string, subject: string | undefined, body: string, metadata?: Record<string, string>): Promise<NotificationResult>;
  checkOptOut?(recipient: string): Promise<boolean>;
  validateRecipient?(recipient: string): boolean;
}

// ============== MOCK PROVIDER (Development) ==============

export class MockNotificationProvider implements NotificationProvider {
  readonly channel: NotificationChannel = "mock";
  readonly name = "Mock Notification Provider";
  private logs: NotificationLog[] = [];
  private optOuts: FollowUpOptOut[] = [];

  async send(recipient: string, subject: string | undefined, body: string, metadata?: Record<string, string>): Promise<NotificationResult> {
    console.log(`[MOCK] Sending to ${recipient}: ${body.substring(0, 50)}...`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    if (Math.random() < 0.1) {
      const result: NotificationResult = { success: false, error: "Simulated network error", timestamp: new Date() };
      this.logResult(recipient, "failed", result.error);
      return result;
    }
    
    const result: NotificationResult = { success: true, messageId: `mock-${Date.now()}`, timestamp: new Date() };
    this.logResult(recipient, "sent");
    return result;
  }

  async checkOptOut(recipient: string): Promise<boolean> {
    return this.optOuts.some((o) => o.channel === "mock" && this.extractId(recipient) === o.patientId);
  }

  validateRecipient(recipient: string): boolean {
    return recipient.length > 0;
  }

  addOptOut(patientId: string, reason?: string): void {
    this.optOuts.push({ patientId, channel: "mock", optedOutAt: new Date(), reason });
  }

  getLogs(): NotificationLog[] { return [...this.logs]; }
  getOptOuts(): FollowUpOptOut[] { return [...this.optOuts]; }
  clearLogs(): void { this.logs = []; }
  private extractId(r: string): string { return r; }

  private logResult(recipient: string, status: NotificationLog["status"], error?: string): void {
    this.logs.push({
      id: `log-${Date.now()}`, followUpTaskId: "mock-task", patientId: this.extractId(recipient),
      channel: "mock", status, errorMessage: error, timestamp: new Date(),
    });
  }
}

// ============== EMAIL PROVIDER (Template) ==============

export class EmailNotificationProvider implements NotificationProvider {
  readonly channel: NotificationChannel = "email";
  readonly name = "Email Notification Provider";
  constructor(private apiKey: string, private fromEmail: string) {}

  async send(recipient: string, subject: string | undefined, body: string): Promise<NotificationResult> {
    console.log(`[EMAIL] Would send to: ${recipient}, Subject: ${subject}`);
    return { success: true, messageId: `email-${Date.now()}`, timestamp: new Date() };
  }

  validateRecipient(recipient: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient);
  }
}

// ============== SMS PROVIDER (Template) ==============

export class SMSNotificationProvider implements NotificationProvider {
  readonly channel: NotificationChannel = "sms";
  readonly name = "SMS Notification Provider";
  constructor(private apiKey: string, private fromNumber: string) {}

  async send(recipient: string, subject: string | undefined, body: string): Promise<NotificationResult> {
    console.log(`[SMS] Would send to: ${recipient}, Body: ${body.substring(0, 50)}...`);
    return { success: true, messageId: `sms-${Date.now()}`, timestamp: new Date() };
  }

  validateRecipient(recipient: string): boolean {
    return /^\+?[\d\s-]{10,}$/.test(recipient);
  }
}

// ============== WHATSAPP PROVIDER (Template) ==============

export class WhatsAppNotificationProvider implements NotificationProvider {
  readonly channel: NotificationChannel = "whatsapp";
  readonly name = "WhatsApp Notification Provider";
  constructor(private apiKey: string, private fromNumber: string) {}

  async send(recipient: string, subject: string | undefined, body: string): Promise<NotificationResult> {
    console.log(`[WHATSAPP] Would send to: ${recipient}, Body: ${body.substring(0, 50)}...`);
    return { success: true, messageId: `wa-${Date.now()}`, timestamp: new Date() };
  }

  validateRecipient(recipient: string): boolean {
    return /^\+[\d]{10,15}$/.test(recipient);
  }
}

// ============== PROVIDER FACTORY ==============

export function createNotificationProvider(channel: NotificationChannel, config?: Record<string, string>): NotificationProvider {
  switch (channel) {
    case "mock": return new MockNotificationProvider();
    case "email": return new EmailNotificationProvider(config?.apiKey || "", config?.fromEmail || "noreply@dentalai.com");
    case "sms": return new SMSNotificationProvider(config?.apiKey || "", config?.fromNumber || "+1555000000");
    case "whatsapp": return new WhatsAppNotificationProvider(config?.apiKey || "", config?.fromNumber || "+1555000000");
    default: throw new Error(`Unknown channel: ${channel}`);
  }
}
