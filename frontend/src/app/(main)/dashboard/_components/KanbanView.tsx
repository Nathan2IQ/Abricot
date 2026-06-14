"use client";

import TaskCard from "./TaskCard";
import type { Task } from "@/app/types";

interface KanbanViewProps {
  tasks: Task[];
}

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

const columns: Column[] = [
  { id: "TODO", title: "À faire", color: "bg-white" },
  { id: "IN_PROGRESS", title: "En cours", color: "bg-white" },
  { id: "DONE", title: "Terminée", color: "bg-white" },
];

export default function KanbanView({ tasks }: KanbanViewProps) {
  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <section className="mb-20 mx-30" aria-label="Vue Kanban des tâches">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <div
              key={column.id}
              className="flex border-2 border-gray-200 rounded-2xl flex-col"
            >
              {/* En-tête de colonne */}
              <div
                className={`${column.color} px-6 py-4 flex rounded-t-2xl items-center gap-4`}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {column.title}
                </h3>
                <span className="bg-[#E5E7EB] border border-transparent rounded-full px-4 py-1 text-sm font-medium text-[#6B7280]">
                  {columnTasks.length}
                </span>
              </div>

              {/* Contenu de la colonne */}
              <div
                className={`${column.color} p-4 flex-1 rounded-b-2xl min-h-125 space-y-4`}
              >
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} variant="kanban" />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-400 italic">
                    Aucune tâche
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
