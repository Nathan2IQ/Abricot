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
    <section
      className="mb-6 sm:mb-10 lg:mb-20"
      aria-label="Vue Kanban des tâches"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <div
              key={column.id}
              className="flex border-2 border-gray-200 rounded-xl lg:rounded-2xl flex-col"
            >
              {/* En-tête de colonne */}
              <div
                className={`${column.color} px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 flex rounded-t-xl lg:rounded-t-2xl items-center gap-2 sm:gap-3 lg:gap-4`}
              >
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                  {column.title}
                </h3>
                <span className="bg-[#E5E7EB] border border-transparent rounded-full px-2 sm:px-3 lg:px-4 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-gray-700">
                  {columnTasks.length}
                </span>
              </div>

              {/* Contenu de la colonne */}
              <div
                className={`${column.color} p-2 sm:p-3 lg:p-4 flex-1 rounded-b-xl lg:rounded-b-2xl min-h-75 sm:min-h-100 lg:min-h-125 space-y-3 sm:space-y-4`}
              >
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} variant="kanban" />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-600 italic">
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
