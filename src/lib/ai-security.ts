// AI Security Module - Prompt Injection & Tool Manipulation Protection
import { createAuditLog, AuditEvent, LogLevel } from "./security";
import { User, hasPermission, Permission } from "./auth";

const INJECTION_PATTERNS = [
  /ignore (previous|all|above|prior) (instructions?|rules?)/gi,
  /disregard (your|this) (instructions?|rules?)/gi,
  /forget (everything|all)/gi,
  /new instructions?:/gi,
  /\[INST\]|\[\/INST\]/g,
  /<\|.*?\|>/g,
  /override|jailbreak|bypass/gi,
];

const DANGEROUS_PATTERNS = [
  /(\b(rm|del|format|drop|truncate)\b.*\b(database|table|files?)\b)/gi,
  /(\b(exec|eval|system|shell)\b\s*\()/gi,
  /\$\(|`/g,
  /union\s+select/gi,
  /<script|javascript:|onerror=/gi,
];

export class AISecurityManager {
  private tools = new Map<string, { requiredPermission: Permission; handler: (p: Record<string, unknown>, u: User) => Promise<unknown> }>();

  detectPromptInjection(input: string): { isInjection: boolean; reason?: string } {
    for (const p of INJECTION_PATTERNS) { if (p.test(input)) return { isInjection: true, reason: "Prompt injection detected" }; }
    return { isInjection: false };
  }

  detectDangerousInput(input: string): { isDangerous: boolean; reason?: string } {
    for (const p of DANGEROUS_PATTERNS) { if (p.test(input)) return { isDangerous: true, reason: "Dangerous pattern detected" }; }
    return { isDangerous: false };
  }

  validateAIInput(input: string, user: User): { valid: boolean; error?: string } {
    const inj = this.detectPromptInjection(input);
    if (inj.isInjection) { console.warn("[AI Security] Injection detected"); return { valid: false, error: "Input validation failed" }; }
    const danger = this.detectDangerousInput(input);
    if (danger.isDangerous) { console.warn("[AI Security] Dangerous input detected"); return { valid: false, error: "Input validation failed" }; }
    return { valid: true };
  }

  canUseTool(toolName: string, user: User): boolean {
    const tool = this.tools.get(toolName);
    return tool ? hasPermission(user, tool.requiredPermission) : false;
  }

  registerTool(name: string, permission: Permission, handler: (p: Record<string, unknown>, u: User) => Promise<unknown>) {
    this.tools.set(name, { requiredPermission: permission, handler });
  }

  async executeTool(toolName: string, params: Record<string, unknown>, user: User) {
    const tool = this.tools.get(toolName);
    if (!tool) return { success: false, error: "Tool not found" };
    if (!this.canUseTool(toolName, user)) return { success: false, error: "Permission denied" };
    try { const result = await tool.handler(params, user); return { success: true, result }; }
    catch (e) { return { success: false, error: e instanceof Error ? e.message : "Tool failed" }; }
  }

  sanitizeAIOutput(output: string): string {
    return output
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[REDACTED]")
      .replace(/\b\d{16}\b/g, "[REDACTED]")
      .replace(/password[=:\s]+\S+/gi, "password=[REDACTED]");
  }
}

export const aiSecurity = new AISecurityManager();

export async function withAISecurity<T>(op: () => Promise<T>, _user: User, _opName: string): Promise<{ success: boolean; data?: T; error?: string }> {
  try { const result = await op(); return { success: true, data: result }; }
  catch (e) { return { success: false, error: "An error occurred" }; }
}