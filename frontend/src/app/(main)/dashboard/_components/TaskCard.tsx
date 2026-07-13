"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faFolderOpen,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import type { Task } from "@/app/types";
import { useState } from "react";
import TaskDetailModal from "./TaskDetailModal";
import { getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  variant?: "list" | "kanban";
}

export default function TaskCard({ task, variant = "list" }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Vue Kanban - Layout vertical compact
  if (variant === "kanban") {
    return (
      <>
        <article className="bg-white border border-gray-200 rounded-xl p-2 sm:p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          {/* Titre */}
          <div className="mb-2">
            <h4 className="text-xs sm:text-sm font-semibold mb-1">
              {task.title}
            </h4>
            {task.description && (
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          {/* Informations */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-4">
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faFolderOpen}
                className="mr-2 w-4"
                aria-hidden="true"
              />
              <span className="font-medium">{task.project.name}</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faClock}
                className="mr-2 w-4"
                aria-hidden="true"
              />
              <span>{formatDate(task.dueDate)}</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faMessage}
                className="mr-2 w-4"
                aria-hidden="true"
              />
              <span>
                {task.commentsCount ?? task.comments?.length ?? 0}{" "}
                commentaire(s)
              </span>
            </div>
          </div>

          {/* Bouton en bas */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-1.5 px-4 sm:py-2 cursor-pointer bg-black text-white rounded-lg transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto"
            aria-label={`Voir les détails de la tâche ${task.title}`}
          >
            Voir
          </button>
        </article>

        <TaskDetailModal
          task={task}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  // Vue Liste - Layout horizontal
  return (
    <>
      <article className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-3">
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-semibold mb-2">
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {task.description}
                  </p>
                )}
              </div>
              <div className="shrink-0">
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(
                    task.status,
                  )}`}
                  role="status"
                  aria-label={`Statut: ${getStatusLabel(task.status)}`}
                >
                  {getStatusLabel(task.status)}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                <div>
                  <FontAwesomeIcon
                    icon={faFolderOpen}
                    className="mr-1 sm:mr-2"
                    width={16}
                    height={16}
                    aria-hidden="true"
                  />{" "}
                  <span className="font-medium">{task.project.name}</span>
                </div>
                <p aria-hidden="true" className="hidden sm:block">
                  |
                </p>
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="mr-1 sm:mr-2"
                    aria-hidden="true"
                  />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
                <p aria-hidden="true" className="hidden sm:block">
                  |
                </p>
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faMessage}
                    className="mr-1 sm:mr-2"
                    aria-hidden="true"
                  />
                  <span>
                    {task.commentsCount ?? task.comments?.length ?? 0}
                  </span>
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 sm:px-8 lg:px-10 py-2 cursor-pointer bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-xs sm:text-sm w-full sm:w-auto"
                  aria-label={`Voir les détails de la tâche ${task.title}`}
                >
                  Voir
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <TaskDetailModal
        task={task}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
