"use client";

import { useState } from "react";
import ViewToggle from "./ViewToggle";
import TasksSection from "./TaskSection";
import KanbanView from "./KanbanView";
import type { Task } from "@/app/types";

type ViewMode = "list" | "kanban";

interface DashboardClientProps {
  tasks: Task[];
}

export default function DashboardClient({ tasks }: DashboardClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  return (
    <>
      <ViewToggle onViewChange={setViewMode} />
      {viewMode === "list" ? (
        <TasksSection tasks={tasks} />
      ) : (
        <KanbanView tasks={tasks} />
      )}
    </>
  );
}
