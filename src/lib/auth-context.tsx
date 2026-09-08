// Auth Context
"use client";
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { User, AuthState, LoginCredentials, Permission, hasPermission } from "./auth";
const KEY = "dentalai_auth";
const DEMO = { "admin@dentalai.com": { p: "admin123", u: { id: "u1", email: "admin@dentalai.com", name: "Admin", role: "admin" as const, createdAt: new Date(), failedLoginAttempts: 0 } }, "dentist@dentalai.com": { p: "dentist123", u: { id: "u2", email: "dentist@dentalai.com", name: "Dr. Smith", role: "dentist" as const, clinicId: "c1", createdAt: new Date(), failedLoginAttempts: 0 } }, "receptionist@dentalai.com": { p: "reception123", u: { id: "u3", email: "receptionist@dentalai.com", name: "Reception", role: "receptionist" as const, clinicId: "c1", createdAt: new Date(), failedLoginAttempts: 0 } } };
interface AuthCtx extends AuthState { login: (c: LoginCredentials) => Promise<boolean>; logout: () => void; hasPermission: (p: Permission) => boolean; canAccessPatient: (id: string) => boolean; }
const AuthContext = createContext<AuthCtx | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<AuthState>({ isAuthenticated: false, user: null, session: null, isLoading: true, error: null });
  useEffect(() => { const s = localStorage.getItem(KEY); if (s) { try { const { user, expiresAt } = JSON.parse(s); if (new Date(expiresAt) > new Date()) setS({ isAuthenticated: true, user, session: null, isLoading: false, error: null }); else localStorage.removeItem(KEY); } catch { localStorage.removeItem(KEY); } } setS(p => ({ ...p, isLoading: false })); }, []);
  const login = useCallback(async (c: LoginCredentials) => { setS(p => ({ ...p, isLoading: true, error: null })); try { await new Promise(r => setTimeout(r, 500)); const d = DEMO[c.email]; if (!d || d.p !== c.password) { setS(p => ({ ...p, isLoading: false, error: "Invalid credentials" })); return false; } const exp = new Date(Date.now() + 86400000); localStorage.setItem(KEY, JSON.stringify({ user: d.u, expiresAt: exp.toISOString() })); setS({ isAuthenticated: true, user: d.u, session: { id: `s-${Date.now()}`, userId: d.u.id, token: `t-${Date.now()}`, refreshToken: `r-${Date.now()}`, expiresAt: exp, createdAt: new Date() }, isLoading: false, error: null }); return true; } catch { setS(p => ({ ...p, isLoading: false, error: "Login failed" })); return false; } }, []);
  const logout = useCallback(() => { localStorage.removeItem(KEY); setS({ isAuthenticated: false, user: null, session: null, isLoading: false, error: null }); }, []);
  const hasP = useCallback((p: Permission) => hasPermission(s.user, p), [s.user]);
  const canA = useCallback((id: string) => { if (!s.user) return false; if (["admin", "receptionist", "dentist"].includes(s.user.role)) return true; return s.user.role === "patient" && s.user.patientId === id; }, [s.user]);
  return <AuthContext.Provider value={{ ...s, login, logout, hasPermission: hasP, canAccessPatient: canA }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const c = useContext(AuthContext); if (!c) throw new Error("useAuth must be within AuthProvider"); return c; }
export function ProtectedRoute({ children, requiredPermission }: { children: ReactNode; requiredPermission?: Permission }) {
  const { isAuthenticated, isLoading, hasPermission: hp } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
  if (!isAuthenticated) return <LoginPage />;
  if (requiredPermission && !hp(requiredPermission)) return <div className="flex flex-col items-center justify-center min-h-screen"><h1 className="text-2xl font-bold">Access Denied</h1></div>;
  return <>{children}</>;
}
function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [e, setE] = useState(""); const [p, setP] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8"><div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4"><span className="text-2xl font-bold text-primary-600">AI</span></div><h1 className="text-2xl font-bold text-gray-900">DentalAI</h1><p className="text-gray-500">Sign in</p></div>
        <form onSubmit={async (x) => { x.preventDefault(); await login({ email: e, password: p }); }} className="space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>}
          <input type="email" placeholder="Email" value={e} onChange={x => setE(x.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
          <input type="password" placeholder="Password" value={p} onChange={x => setP(x.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
          <button type="submit" disabled={isLoading} className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">{isLoading ? "..." : "Sign In"}</button>
        </form>
        <div className="mt-6 p-4 bg-gray-50 rounded text-sm"><p className="font-medium">Demo:</p><p>admin@dentalai.com / admin123</p></div>
      </div>
    </div>
  );
}