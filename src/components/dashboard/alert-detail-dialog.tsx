"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { Alert } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Check, User, Clock, MessageSquare } from "lucide-react";

interface AlertDetailDialogProps {
  alert: Alert | null;
  open: boolean;
  onClose: () => void;
}

export function AlertDetailDialog({ alert, open, onClose }: AlertDetailDialogProps) {
  const { acknowledgeAlert, resolveAlert, addAlertNote } = useApp();
  const [noteText, setNoteText] = useState("");

  if (!alert) return null;

  const handleAddNote = () => {
    if (noteText.trim()) {
      addAlertNote(alert.id, noteText);
      setNoteText("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Alert Details" className="max-w-lg">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={alert.priority === "urgent" ? "danger" : alert.priority === "high" ? "warning" : "default"}>
            {alert.priority}
          </Badge>
          <span className="text-sm text-gray-500">{alert.type}</span>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{alert.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {alert.patient.name}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatDateTime(alert.createdAt)}
          </span>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Internal Notes</h4>
          {alert.notes.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No notes yet</p>
          ) : (
            <div className="space-y-2">
              {alert.notes.map((note) => (
                <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{note.author}</span>
                    <span className="text-xs text-gray-400">{formatDateTime(note.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{note.text}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Textarea placeholder="Add a note..." value={noteText} onChange={(e) => setNoteText(e.target.value)} className="flex-1" rows={2} />
          </div>
          <Button variant="outline" size="sm" onClick={handleAddNote} disabled={!noteText.trim()}>
            <MessageSquare className="h-4 w-4 mr-1" />
            Add Note
          </Button>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          {!alert.acknowledged && (
            <Button variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
              Acknowledge
            </Button>
          )}
          <Button variant="primary" onClick={() => { resolveAlert(alert.id); onClose(); }}>
            <Check className="h-4 w-4 mr-1" />
            Mark Resolved
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
