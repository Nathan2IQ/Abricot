"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faClock,
  faFolderOpen,
  faMessage,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import type { Task } from "@/app/types";
import { useEffect } from "react";

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

// Fonction pour obtenir la couleur de statut
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DONE: "bg-[#F1FFF7] text-[#27AE60]",
    IN_PROGRESS: "bg-[#FFF0D7] text-[#E08D00]",
    TODO: "bg-[#FFE0E0] text-[#EF4444]",
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

// Fonction pour formater la date et l'heure
function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TaskDetailModal({
  task,
  isOpen,
  onClose,
}: TaskDetailModalProps) {
  // Fermer la modale avec la touche Échap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Empêcher le scroll du body
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="flex items-center justify-center min-h-full p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* En-tête */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between shrink-0">
            <div className="flex-1 pr-4">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
                {task.title}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    task.status,
                  )}`}
                >
                  {getStatusLabel(task.status)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors p-2"
              aria-label="Fermer la modale"
            >
              <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
            </button>
          </div>

          {/* Contenu */}
          <div className="px-6 py-6 space-y-6 overflow-y-auto flex-1">
            {/* Description */}
            {task.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {task.description}
                </p>
              </div>
            )}

            {/* Informations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Projet */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-1">
                  <FontAwesomeIcon
                    icon={faFolderOpen}
                    className="w-5 h-5 mr-2"
                  />
                  <span className="font-semibold">Projet</span>
                </div>
                <p className="text-gray-900 ml-7">{task.project.name}</p>
                {task.project.description && (
                  <p className="text-gray-600 text-sm ml-7 mt-1">
                    {task.project.description}
                  </p>
                )}
              </div>

              {/* Date d'échéance */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-1">
                  <FontAwesomeIcon icon={faClock} className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Date d&apos;échéance</span>
                </div>
                <p className="text-gray-900 ml-7">{formatDate(task.dueDate)}</p>
              </div>
            </div>

            {/* Assignés */}
            {task.assignees && task.assignees.length > 0 && (
              <div>
                <div className="flex items-center text-gray-600 mb-3">
                  <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Assignés ({task.assignees.length})
                  </h3>
                </div>
                <div className="space-y-2 ml-7">
                  {task.assignees.map((assignee) => (
                    <div
                      key={assignee.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {assignee.user.name
                          ? assignee.user.name.charAt(0).toUpperCase()
                          : assignee.user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {assignee.user.name || "Sans nom"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {assignee.user.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Commentaires */}
            <div>
              <div className="flex items-center text-gray-600 mb-3">
                <FontAwesomeIcon icon={faMessage} className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Commentaires ({task.comments?.length ?? 0})
                </h3>
              </div>
              {task.comments && task.comments.length > 0 ? (
                <div className="space-y-4 ml-7">
                  {task.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {comment.author.name
                            ? comment.author.name.charAt(0).toUpperCase()
                            : comment.author.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900">
                              {comment.author.name || comment.author.email}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(comment.createdAt)}
                            </p>
                          </div>
                          <p className="text-gray-700 mt-2">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic ml-7">Aucun commentaire</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2 cursor-pointer bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
