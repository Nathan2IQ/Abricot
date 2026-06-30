"use client";

import { useState, useMemo } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListUl,
  faCalendar,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import KanbanView from "@/app/(main)/dashboard/_components/KanbanView";
import ProjetTaskCard from "./ProjetTaskCard";
import type { Task } from "@/app/types";

type ViewMode = "list" | "kanban";

interface ProjectTasksProps {
  tasks: Task[];
  projectId: string;
  canEdit: boolean;
  collaborators: Array<{ id: string; name: string | null; email: string }>;
  onUpdateTask: (
    taskId: string,
    payload: {
      title: string;
      description?: string;
      status: Task["status"];
      dueDate?: string;
    },
  ) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onAddComment: (taskId: string, content: string) => Promise<void>;
}

export default function ProjectTasks({
  tasks,
  projectId,
  canEdit,
  collaborators,
  onUpdateTask,
  onDeleteTask,
  onAddComment,
}: ProjectTasksProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les tâches
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filtre par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [tasks, statusFilter, searchQuery]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8">
      {/* En-tête avec titre et contrôles */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Tâches</h2>
          <p className="text-gray-500 text-sm">Par ordre de priorité</p>
        </div>

        <div className="flex items-center gap-8">
          {/* Toggle Vue Liste/Calendrier */}
          <div className="flex p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`px-5 py-3 rounded-md cursor-pointer flex mr-4 items-center gap-2 text-sm transition-colors ${
                viewMode === "list"
                  ? "bg-[#FFE8D9] text-[#D3590B]"
                  : "text-[#D3590B]"
              }`}
            >
              <FontAwesomeIcon icon={faListUl} className="w-4 h-4" />
              Liste
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-5 py-3 rounded-md cursor-pointer flex items-center gap-2 text-sm transition-colors ${
                viewMode === "kanban"
                  ? "bg-[#FFE8D9] text-[#D3590B]"
                  : "text-[#D3590B]"
              }`}
            >
              <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
              Calendrier
            </button>
          </div>

          {/* Filtre Statut */}
          <div className="relative">
            <label htmlFor="status-filter" className="sr-only">
              Filtrer par statut
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-5 py-3 border border-[#E5E7EB] text-[#6B7280] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent appearance-none pr-10 bg-white"
            >
              <option value="all">Statut</option>
              <option value="TODO">À faire</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="DONE">Terminé</option>
            </select>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3 h-3"
              aria-hidden="true"
            />
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <label htmlFor="search-tasks" className="sr-only">
              Rechercher une tâche
            </label>
            <input
              type="search"
              id="search-tasks"
              placeholder="Rechercher une tâche"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-70 px-5 py-3 pr-10 border border-[#E5E7EB] text-[#6B7280] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent appearance-none bg-white"
              aria-label="Rechercher une tâche"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Contenu des tâches */}
      <div>
        {viewMode === "list" ? (
          <div className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <ProjetTaskCard
                  key={task.id}
                  task={task}
                  projectId={projectId}
                  canEdit={canEdit}
                  collaborators={collaborators}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                  onAddComment={onAddComment}
                />
              ))
            ) : (
              <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-xl text-center">
                {tasks.length === 0
                  ? "Aucune tâche dans ce projet"
                  : "Aucune tâche ne correspond à votre recherche"}
              </div>
            )}
          </div>
        ) : (
          <KanbanView tasks={filteredTasks} />
        )}
      </div>
    </div>
  );
}
