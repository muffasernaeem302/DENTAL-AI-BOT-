"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { FollowUpTask, FollowUpType, NotificationChannel } from "@/lib/followup-types";
import { MessageSquare, Send, Bell, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

const TL: Record<FollowUpType, string> = { appointment_reminder: "Appt Reminder", missed_appointment: "Missed Appt", post_visit_checkin: "Post-Visit", followup_appointment_reminder: "Follow-up" };
const SS: Record<string, string> = { pending: "bg-warning-100 text-warning-700", sent: "bg-success-100 text-success-700", failed: "bg-danger-100 text-danger-700" };

export function FollowUpPanel() {
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [stats, setStats] = useState({ pending: 0, sent: 0, failed: 0, total: 0 });
  const [load, setLoad] = useState(true);
  const [sel, setSel] = useState<FollowUpTask | null>(null);
  const [showD, setShowD] = useState(false);
  const [showC, setShowC] = useState(false);
  const refresh = () => fetch("/api/followup").then(r => r.json()).then(d => { if (d.success) { setTasks(d.tasks); setStats(d.stats); } setLoad(false); });
  useEffect(() => { refresh(); }, []);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <SC l="Total" v={stats.total} i={MessageSquare} c="text-gray-600" />
        <SC l="Pending" v={stats.pending} i={Clock} c="text-warning-600" />
        <SC l="Sent" v={stats.sent} i={CheckCircle} c="text-success-600" />
        <SC l="Failed" v={stats.failed} i={AlertCircle} c="text-danger-600" />
      </div>
      <Card>
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2"><MessageSquare className="h-5 w-5" />Follow-ups</h3>
          <Button variant="primary" size="sm" onClick={() => setShowC(true)}><Send className="h-4 w-4 mr-1" />Create</Button>
        </div>
        <CardContent className="p-0">{load ? <p className="p-8 text-center">Loading...</p> : tasks.length === 0 ? <p className="p-8 text-center text-gray-500">No follow-ups</p> : tasks.map(t => (
          <div key={t.id} className="p-4 hover:bg-gray-50 border-b flex items-center gap-3">
            <Bell className="h-5 w-5 text-gray-400" />
            <div className="flex-1"><div className="flex gap-2"><span className="text-sm font-medium">{TL[t.type]}</span><Badge className={SS[t.status] || ""}>{t.status}</Badge></div><p className="text-xs text-gray-500">{t.channel} • {formatDate(t.scheduledFor)}</p></div>
            <Button variant="ghost" size="sm" onClick={() => { setSel(t); setShowD(true); }}>View</Button>
          </div>
        ))}</CardContent>
      </Card>
      <Dialog open={showD} onClose={() => setShowD(false)} title="Details" className="max-w-md">{sel && <div className="p-6"><Badge variant={sel.status === "failed" ? "danger" : "default"}>{sel.status}</Badge><h3 className="font-medium mt-2">{TL[sel.type]}</h3><p className="text-sm mt-2 p-3 bg-gray-50 rounded">{sel.message.body}</p><div className="flex justify-end mt-4"><Button variant="outline" onClick={() => setShowD(false)}>Close</Button></div></div>}</Dialog>
      <CD open={showC} onClose={() => setShowC(false)} onOk={refresh} />
    </div>
  );
}

function SC({ l, v, i: I, c }: { l: string; v: number; i: typeof Bell; c: string }) { return <Card><CardContent className="p-4"><p className="text-sm text-gray-500">{l}</p><p className="text-2xl font-bold">{v}</p><I className={`h-6 w-6 ${c} mt-2`} /></CardContent></Card>; }

function CD({ open, onClose, onOk }: { open: boolean; onClose: () => void; onOk: () => void }) {
  const [pid, setPid] = useState("");
  const [type, setType] = useState<FollowUpType>("post_visit_checkin");
  const [ch, setCh] = useState<NotificationChannel>("mock");
  const ok = () => { if (!pid) return; fetch("/api/followup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", patientId: pid, type, channel: ch }) }).then(r => r.json()).then((d: any) => { if (d.success) { onOk(); onClose(); } }); };
  return <Dialog open={open} onClose={onClose} title="Create Follow-up" className="max-w-sm"><div className="p-6 space-y-4">
    <Select label="Patient" value={pid} onChange={(e: any) => setPid(e.target.value)} options={[{ value: "", label: "Select..." }, { value: "p1", label: "Alexandra Mitchell" }, { value: "p2", label: "Benjamin Foster" }, { value: "p3", label: "Priya Sharma" }]} />
    <Select label="Type" value={type} onChange={(e: any) => setType(e.target.value as FollowUpType)} options={[{ value: "appointment_reminder", label: "Appointment Reminder" }, { value: "missed_appointment", label: "Missed Appointment" }, { value: "post_visit_checkin", label: "Post-Visit Check-in" }]} />
    <Select label="Channel" value={ch} onChange={(e: any) => setCh(e.target.value as NotificationChannel)} options={[{ value: "mock", label: "Mock" }, { value: "email", label: "Email" }, { value: "sms", label: "SMS" }]} />
    <div className="flex justify-end gap-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button variant="primary" onClick={ok} disabled={!pid}>Create</Button></div>
  </div></Dialog>;
}
