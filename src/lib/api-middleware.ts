// API Security Middleware
import { NextRequest, NextResponse } from "next/server";
import { RATE_LIMITS, detectSuspiciousInput, createAuditLog, AuditEvent } from "./security";
import { User, Permission, hasPermission, AuthorizationError } from "./auth";

const rateStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const r = rateStore.get(key);
  if (!r || r.resetAt < now) { rateStore.set(key, { count: 1, resetAt: now + windowMs }); return { allowed: true, remaining: limit - 1 }; }
  if (r.count >= limit) return { allowed: false, remaining: 0 };
  r.count++;
  return { allowed: true, remaining: limit - r.count };
}

async function verifySession(request: NextRequest): Promise<User | null> {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  if (token.startsWith("token-")) return { id: "u1", email: "user@example.com", name: "Demo User", role: "admin", createdAt: new Date(), failedLoginAttempts: 0 };
  return null;
}

export function validateRequired(v: unknown, name: string): string { if (v === undefined || v === null || v === "") throw new Error(`${name} required`); return String(v); }
export function validateEmail(email: string): string { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email"); return email.slice(0, 255); }
export function validateLength(v: string, min: number, max: number, name: string): string { if (v.length < min) throw new Error(`${name} too short`); if (v.length > max) throw new Error(`${name} too long`); return v; }
export function validateEnum<T>(v: string, vals: T[], name: string): T { if (!vals.includes(v as unknown as T)) throw new Error(`Invalid ${name}`); return v as unknown as T; }
export function validateInt(v: unknown, name: string): number { const n = Number(v); if (!Number.isInteger(n) || n < 0) throw new Error(`${name} must be positive int`); return n; }

export const unauthorized = (m = "Unauthorized") => NextResponse.json({ success: false, error: m }, { status: 401 });
export const forbidden = (m = "Forbidden") => NextResponse.json({ success: false, error: m }, { status: 403 });
export const badRequest = (m: string, d?: Record<string, unknown>) => NextResponse.json({ success: false, error: m, ...d && { details: d } }, { status: 400 });
export const notFound = (m = "Not found") => NextResponse.json({ success: false, error: m }, { status: 404 });
export const tooMany = (retry?: number) => { const h: Record<string, string> = {}; if (retry) h["Retry-After"] = retry.toString(); return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429, headers: h }); };
export const serverError = () => { console.error("API Error"); return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 }); };

function withHeaders(r: NextResponse): NextResponse {
  const h = new Headers(r.headers);
  ["X-Content-Type-Options", "X-Frame-Options", "X-XSS-Protection", "Referrer-Policy"].forEach(k => h.set(k, k === "X-Frame-Options" ? "DENY" : k === "X-XSS-Protection" ? "1; mode=block" : "strict-origin-when-cross-origin"));
  return new NextResponse(h.get("body"), { status: r.status, headers: h });
}

type Handler = (req: NextRequest, user: User | null, params: Record<string, unknown>) => Promise<NextResponse>;

export function withMiddleware(handlers: Record<string, Handler>, opts: { rateLimit?: { limit: number; window: number }; requireAuth?: boolean; requiredPermission?: Permission } = {}) {
  return async (request: NextRequest, params: Record<string, unknown> = {}): Promise<NextResponse> => {
    try {
      const ip = request.headers.get("x-forwarded-for") || "unknown";
      const key = `${request.nextUrl.pathname}:${ip}`;
      let remaining = 0, limit = 100;
      
      if (opts.rateLimit) {
        const { allowed, remaining: r } = checkRateLimit(key, opts.rateLimit.limit, opts.rateLimit.window * 60000);
        remaining = r; limit = opts.rateLimit.limit;
        if (!allowed) return withHeaders(tooMany(opts.rateLimit.window * 60));
      }
      
      const user = await verifySession(request);
      if (opts.requireAuth && !user) return withHeaders(unauthorized());
      if (opts.requiredPermission && user && !hasPermission(user, opts.requiredPermission)) return withHeaders(forbidden("Insufficient permissions"));
      
      const handler = handlers[request.method];
      if (!handler) return withHeaders(badRequest("Method not allowed"));
      
      let response = await handler(request, user, params);
      const h = new Headers(response.headers);
      h.set("X-RateLimit-Limit", limit.toString());
      h.set("X-RateLimit-Remaining", remaining.toString());
      return withHeaders(new NextResponse(response.body, { status: response.status, headers: h }));
    } catch (e) {
      if (e instanceof AuthorizationError) return withHeaders(forbidden(e.message));
      console.error("API Error:", e);
      return withHeaders(serverError());
    }
  };
}
