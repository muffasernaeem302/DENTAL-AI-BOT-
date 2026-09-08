// Follow-up Agent Service
import { FollowUpTask, FollowUpType, FollowUpStatus, NotificationChannel, FOLLOWUP_TEMPLATES, FOLLOWUP_SCHEDULES, CLINIC_CONFIG } from "./followup-types";
import { NotificationProvider, NotificationResult, createNotificationProvider } from "./notification-provider";
import { Patient } from "./types";

export interface CreateFollowUpParams { patientId: string; patientName: string; patientEmail: string; patientPhone: string; appointmentId?: string; appointmentDate?: string; appointmentTime?: string; type: FollowUpType; channel: NotificationChannel; customMessage?: string; }
export interface FollowUpAgentConfig { maxRetries: number; retryDelayMs: number; defaultChannel: NotificationChannel; enabled: boolean; }
const DC: FollowUpAgentConfig = { maxRetries: 3, retryDelayMs: 60000, defaultChannel: "mock", enabled: true };

export class FollowUpAgent {
  private tasks = new Map<string, FollowUpTask>();
  private provider: NotificationProvider;
  private config: FollowUpAgentConfig;
  private processing = false;
  private interval: ReturnType<typeof setInterval> | null = null;

  constructor(cfg: Partial<FollowUpAgentConfig> = {}) { this.config = { ...DC, ...cfg }; this.provider = createNotificationProvider(this.config.defaultChannel); }
  start(): void { if (this.interval) return; this.interval = setInterval(() => this.processTasks(), 30000); this.processTasks(); }
  stop(): void { if (this.interval) { clearInterval(this.interval); this.interval = null; } }

  createFollowUp(p: CreateFollowUpParams): FollowUpTask {
    const sched = FOLLOWUP_SCHEDULES.find((s) => s.type === p.type && s.channel === p.channel) || FOLLOWUP_SCHEDULES.find((s) => s.type === p.type);
    const tmpl = FOLLOWUP_TEMPLATES[p.type];
    const vals = { patientName: p.patientName, clinicName: CLINIC_CONFIG.name, clinicPhone: CLINIC_CONFIG.phone, appointmentDate: p.appointmentDate || "", appointmentTime: p.appointmentTime || "" };
    const body = tmpl.body.replace(/\{\{(\w+)\}\}/g, (_, k) => vals[k as keyof typeof vals] || _);
    const schedFor = new Date();
    if (sched) schedFor.setHours(schedFor.getHours() + sched.delayHours);
    const task: FollowUpTask = { id: `fu-${Date.now()}`, patientId: p.patientId, appointmentId: p.appointmentId, type: p.type, scheduledFor: schedFor, status: "pending", channel: p.channel, message: { templateId: tmpl.id, subject: tmpl.subject, body: p.customMessage || body, channel: p.channel }, retryCount: 0, maxRetries: this.config.maxRetries, createdAt: new Date(), updatedAt: new Date() };
    this.tasks.set(task.id, task); return task;
  }

  scheduleFromAppointment(patient: Patient, aptDate: Date, aptId: string, event: "created" | "completed" | "missed"): FollowUpTask | null {
    const typeMap = { created: "appointment_reminder" as const, completed: "post_visit_checkin" as const, missed: "missed_appointment" as const };
    return this.createFollowUp({ patientId: patient.id, patientName: patient.name, patientEmail: patient.email, patientPhone: patient.phone, appointmentId: aptId, appointmentDate: aptDate.toLocaleDateString(), appointmentTime: aptDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), type: typeMap[event], channel: this.config.defaultChannel });
  }

  cancelFollowUp(id: string): boolean { const t = this.tasks.get(id); if (!t) return false; t.status = "cancelled"; t.updatedAt = new Date(); this.tasks.set(id, t); return true; }
  optOut(patientId: string, channel: NotificationChannel): void { this.tasks.forEach((t, id) => { if (t.patientId === patientId && t.channel === channel && t.status === "pending") { t.status = "opt_out"; t.updatedAt = new Date(); this.tasks.set(id, t); } }); }
  getTasks(f?: { patientId?: string; status?: FollowUpStatus; type?: FollowUpType }): FollowUpTask[] { let ts = Array.from(this.tasks.values()); if (f?.patientId) ts = ts.filter((t) => t.patientId === f.patientId); if (f?.status) ts = ts.filter((t) => t.status === f.status); if (f?.type) ts = ts.filter((t) => t.type === f.type); return ts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); }
  getTask(id: string): FollowUpTask | undefined { return this.tasks.get(id); }
  getStats() { const ts = Array.from(this.tasks.values()); return { pending: ts.filter((t) => t.status === "pending" || t.status === "scheduled").length, sent: ts.filter((t) => t.status === "sent" || t.status === "delivered").length, failed: ts.filter((t) => t.status === "failed").length, total: ts.length }; }

  private async processTasks(): Promise<void> { if (this.processing || !this.config.enabled) return; this.processing = true; const pending = Array.from(this.tasks.values()).filter((t) => (t.status === "pending" || t.status === "scheduled") && t.scheduledFor <= new Date()); for (const task of pending) await this.sendTask(task); this.processing = false; }
  private async sendTask(task: FollowUpTask): Promise<void> { task.status = "scheduled"; task.updatedAt = new Date(); this.tasks.set(task.id, task); try { if (this.provider.checkOptOut && await this.provider.checkOptOut(task.patientId)) { task.status = "opt_out"; task.updatedAt = new Date(); this.tasks.set(task.id, task); return; } const r: NotificationResult = await this.provider.send(task.patientId, task.message.subject, task.message.body); if (r.success) { task.status = "sent"; task.sentAt = r.timestamp; } else { throw new Error(r.error); } } catch (e) { task.retryCount++; task.lastError = e instanceof Error ? e.message : "Error"; task.status = task.retryCount >= task.maxRetries ? "failed" : "pending"; if (task.status === "pending") task.scheduledFor = new Date(Date.now() + this.config.retryDelayMs); } task.updatedAt = new Date(); this.tasks.set(task.id, task); }
}

let _inst: FollowUpAgent | null = null;
export function getFollowUpAgent(): FollowUpAgent { if (!_inst) { _inst = new FollowUpAgent(); _inst.start(); } return _inst; }
