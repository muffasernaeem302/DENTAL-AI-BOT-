// API Route for Follow-up Management - SECURED
import { NextRequest, NextResponse } from "next/server";
import { getFollowUpAgent } from "@/lib/followup-agent-core";
import { mockPatients } from "@/lib/data";
import { validateRequired, validateLength, badRequest } from "@/lib/api-middleware";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId") || undefined;
    const status = searchParams.get("status") || undefined;
    const type = searchParams.get("type") || undefined;

    const safePatientId = patientId ? validateLength(patientId, 1, 50, "patientId") : undefined;
    const safeStatus = status ? validateLength(status, 1, 20, "status") : undefined;
    const safeType = type ? validateLength(type, 1, 30, "type") : undefined;

    const agent = getFollowUpAgent();
    const tasks = agent.getTasks({ patientId: safePatientId, status: safeStatus as any, type: safeType as any });
    return NextResponse.json({ success: true, tasks, stats: agent.getStats() });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Invalid request");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, patientId, taskId, type, channel, customMessage } = body;

    const safeAction = validateLength(validateRequired(action, "action"), 1, 50, "action");
    if (!["create", "cancel", "optout"].includes(safeAction)) {
      return badRequest("Invalid action");
    }

    const agent = getFollowUpAgent();

    if (safeAction === "create") {
      const safePatientId = validateLength(validateRequired(patientId, "patientId"), 1, 50, "patientId");
      const patient = mockPatients.find((p) => p.id === safePatientId);
      if (!patient) return badRequest("Patient not found");

      const safeMessage = customMessage ? validateLength(customMessage, 0, 5000, "customMessage") : undefined;

      const task = agent.createFollowUp({
        patientId: patient.id,
        patientName: patient.name,
        patientEmail: patient.email,
        patientPhone: patient.phone,
        type,
        channel,
        customMessage: safeMessage,
      });
      return NextResponse.json({ success: true, task });
    }

    if (safeAction === "cancel") {
      const safeTaskId = validateLength(validateRequired(taskId, "taskId"), 1, 50, "taskId");
      const result = agent.cancelFollowUp(safeTaskId);
      return NextResponse.json({ success: result, message: result ? "Follow-up cancelled" : "Task not found" });
    }

    if (safeAction === "optout") {
      const safePatientId = validateLength(validateRequired(patientId, "patientId"), 1, 50, "patientId");
      agent.optOut(safePatientId, channel);
      return NextResponse.json({ success: true });
    }

    return badRequest("Unknown action");
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Invalid request");
  }
}
 
