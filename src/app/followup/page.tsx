// Follow-up Management Page
"use client";
import { FollowUpPanel } from "@/components/dashboard/followup-panel";

export default function FollowUpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Follow-up Agent</h1>
        <p className="text-sm text-gray-500 mt-1">Manage automated patient follow-up communications</p>
      </div>
      <FollowUpPanel />
    </div>
  );
}
