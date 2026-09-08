// API Route for Individual Follow-up Task - SECURED
import { NextRequest, NextResponse } from "next/server";
import { getFollowUpAgent } from "@/lib/followup-agent-core";
import { validateLength, badRequest } from "@/lib/api-middleware";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const safeId = validateLength(id, 1, 50, "id");
    
    const agent = getFollowUpAgent();
    const task = agent.getTask(safeId);

    if (!task) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, task });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Invalid request");
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const safeId = validateLength(id, 1, 50, "id");
    
    const agent = getFollowUpAgent();
    const result = agent.cancelFollowUp(safeId);

    return NextResponse.json({ success: result, message: result ? "Task deleted" : "Task not found or already completed" });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Invalid request");
  }
}
 
