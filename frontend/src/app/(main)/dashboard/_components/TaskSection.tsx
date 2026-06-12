"use client";

import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import TaskCard from "./TaskCard";
import type { Task } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useMemo } from "react";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les tâches en fonction de la recherche
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) {
      return tasks;
    }

    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.project.name.toLowerCase().includes(query),
    );
  }, [tasks, searchQuery]);

  if (tasks.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-xl text-center mx-30">
        Aucune tâche assignée pour le moment
      </div>
    );
  }

  return (
    <section
      className="bg-white border border-gray-200 rounded-xl p-10 mb-20 mx-30"
      aria-labelledby="tasks-heading"
    >
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 id="tasks-heading" className="text-xl font-semibold mb-3">
            Mes tâches assignées
          </h3>
          <p className="text-gray-500">Par ordre de priorité</p>
        </div>
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
            className="w-full py-4 px-8 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Rechercher une tâche"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-8 rounded-xl text-center">
            Aucune tâche trouvée pour &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </section>
  );
}
