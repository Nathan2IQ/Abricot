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

interface TaskCardProps {
  task: Task;
  variant?: "list" | "kanban";
}

// Fonction pour obtenir la couleur de statut
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DONE: "bg-[#F1FFF7] text-[#27AE60]", // Vert clair pour DONE
    IN_PROGRESS: "bg-[#FFF0D7] text-[#E08D00]", // Orange clair pour IN_PROGRESS
    TODO: "bg-[#FFE0E0] text-[#EF4444]", // Rouge clair pour TODO
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

// Fonction pour obtenir le libellé du statut
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    TODO: "À faire",
    IN_PROGRESS: "En cours",
    DONE: "Terminé",
  };
  return labels[status] || status;
}

// Fonction pour formater la date
function formatDate(dateString?: string): string {
  if (!dateString) return "Pas de date limite";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function TaskCard({ task, variant = "list" }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Vue Kanban - Layout vertical compact
  if (variant === "kanban") {
    return (
      <>
        <article className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          {/* Titre */}
          <div className="mb-3">
            <h4 className="text-base font-semibold mb-2">{task.title}</h4>
            {task.description && (
              <p className="text-gray-600 text-sm line-clamp-2">
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
            className="py-2 w-30 cursor-pointer bg-black text-white rounded-lg transition-colors text-sm font-medium"
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
      <article className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold mb-2">{task.title}</h4>
                {task.description && (
                  <p className="text-gray-600 mb-3">{task.description}</p>
                )}
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    task.status,
                  )}`}
                  role="status"
                  aria-label={`Statut: ${getStatusLabel(task.status)}`}
                >
                  {getStatusLabel(task.status)}
                </span>
              </div>
            </div>
            <div className="flex items-center  justify-between gap-4 text-sm text-gray-600">
              <div className="flex gap-4 items-center">
                <div>
                  <FontAwesomeIcon
                    icon={faFolderOpen}
                    className="mr-2"
                    width={20}
                    height={20}
                    aria-hidden="true"
                  />{" "}
                  <span className="font-medium">{task.project.name}</span>
                </div>
                <p aria-hidden="true">|</p>
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="mr-2"
                    aria-hidden="true"
                  />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
                <p aria-hidden="true">|</p>
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faMessage}
                    className="mr-2"
                    aria-hidden="true"
                  />
                  <span>
                    {task.commentsCount ?? task.comments?.length ?? 0}
                  </span>
                </div>
              </div>
              <div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-10 py-2 cursor-pointer bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
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
