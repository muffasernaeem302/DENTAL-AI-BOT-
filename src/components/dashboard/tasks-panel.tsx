"use client";

import { useApp } from "@/lib/context";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Clock, User, ClipboardList } from "lucide-react";

export function TasksPanel() {
  const { followUpTasks, updateTaskStatus } = useApp();

  const pendingTasks = followUpTasks.filter((t) => t.status !== "completed");
  const sortedTasks = [...pendingTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const handleComplete = (taskId: string) => {
    updateTaskStatus(taskId, "completed");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary-600" />
          Follow-up Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {sortedTasks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Check className="h-12 w-12 mx-auto mb-2 text-success-500" />
            <p>All tasks completed!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedTasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                      <Badge variant={task.priority === "high" ? "danger" : task.priority === "medium" ? "warning" : "default"}>
                        {task.priority}
                      </Badge>
                      <Badge variant={task.status === "in-progress" ? "primary" : "default"}>
                        {task.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {task.patient.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due: {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {task.status !== "completed" && (
                      <Button variant="ghost" size="sm" onClick={() => handleComplete(task.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
