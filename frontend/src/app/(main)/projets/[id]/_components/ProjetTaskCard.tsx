"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faChevronDown,
  faChevronUp,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import type { Task } from "@/app/types";
import TaskEditModal from "./TaskEditModal";

interface ProjetTaskCardProps {
  task: Task;
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
      assigneeIds: string[];
    },
  ) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onAddComment: (taskId: string, content: string) => Promise<void>;
}

// Fonction pour obtenir les initiales d'un nom
function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
}

// Fonction pour formater la date
function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Pas d'échéance";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
  };
  return date.toLocaleDateString("fr-FR", options);
}

// Fonction pour obtenir le style du badge de statut
function getStatusBadge(status: Task["status"]): {
  label: string;
  className: string;
} {
  switch (status) {
    case "TODO":
      return {
        label: "À faire",
        className: "bg-red-100 text-red-700",
      };
    case "IN_PROGRESS":
      return {
        label: "En cours",
        className: "bg-[#FFF0D7] text-[#E08D00]",
      };
    case "DONE":
      return {
        label: "Terminé",
        className: "bg-green-100 text-green-700",
      };
  }
}

export default function ProjetTaskCard({
  task,
  projectId,
  canEdit,
  collaborators,
  onUpdateTask,
  onDeleteTask,
  onAddComment,
}: ProjetTaskCardProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const statusBadge = getStatusBadge(task.status);
  const commentsCount = task.commentsCount || task.comments?.length || 0;

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [menuOpen]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      {/* En-tête : Titre + Badge statut + Menu actions */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex-1 flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {task.title}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}
            >
              {statusBadge.label}
            </span>
          </div>
          {/* Description */}
          {task.description && (
            <p className="text-gray-600 text-sm mb-4 mt-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Menu 3 points */}
        {canEdit && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Actions de la tâche"
            >
              <FontAwesomeIcon
                icon={faEllipsisV}
                className="w-4 h-4 cursor-pointer border p-4 border-gray-200 rounded-xl text-gray-600"
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setIsEditOpen(true);
                  }}
                  className="w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Modifier la tâche
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Échéance */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">
          Échéance :
          <FontAwesomeIcon
            icon={faCalendar}
            className="w-4 h-4 text-gray-400 ml-1"
          />
        </span>
        <span className="text-sm text-gray-700 font-medium">
          {formatDate(task.dueDate)}
        </span>
      </div>

      {/* Collaborateurs assignés */}
      {task.assignees && task.assignees.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 font-medium mb-2">Assigné à :</p>
          <div className="flex flex-wrap gap-2">
            {task.assignees.map((assignee) => (
              <div
                key={assignee.id}
                className="inline-flex items-center gap-2 px-3 py-1  rounded-full"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 text-gray-700 text-xs font-semibold">
                  {getInitials(assignee.user.name)}
                </span>
                <span className="text-sm bg-[#E5E7EB] py-1 px-2 rounded-xl text-gray-700">
                  {assignee.user.name || assignee.user.email}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Commentaires (dropdown) */}
      <div className="border-t border-gray-200  pt-4">
        <button
          onClick={() => {
            setCommentsOpen(!commentsOpen);
            setCommentError("");
          }}
          className="w-full flex items-center justify-between cursor-pointer text-gray-700 hover:text-gray-900 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Commentaires ({commentsCount})
            </span>
          </div>
          <FontAwesomeIcon
            icon={commentsOpen ? faChevronUp : faChevronDown}
            className="w-4 h-4"
          />
        </button>

        {/* Liste des commentaires */}
        {commentsOpen && (
          <div className="mt-3 space-y-3">
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                if (!commentDraft.trim()) return;
                setIsCommentSubmitting(true);
                setCommentError("");
                try {
                  await onAddComment(task.id, commentDraft.trim());
                  setCommentDraft("");
                } catch (error) {
                  setCommentError(
                    error instanceof Error
                      ? error.message
                      : "Impossible d'ajouter le commentaire",
                  );
                } finally {
                  setIsCommentSubmitting(false);
                }
              }}
              className="bg-gray-50 rounded-lg p-3 border border-gray-100"
            >
              <label
                htmlFor={`comment-${task.id}`}
                className="block text-xs font-medium text-gray-500 mb-2"
              >
                Ajouter un commentaire
              </label>
              <textarea
                id={`comment-${task.id}`}
                value={commentDraft}
                onChange={(event) => setCommentDraft(event.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                placeholder="Écrire un commentaire"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isCommentSubmitting || !commentDraft.trim()}
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Commenter
                </button>
              </div>
              {commentError && (
                <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {commentError}
                </p>
              )}
            </form>

            {task.comments && task.comments.length > 0 ? (
              task.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 text-gray-700 text-xs font-semibold">
                      {getInitials(comment.author.name)}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {comment.author.name || comment.author.email}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 pl-8">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic py-2">
                Aucun commentaire
              </p>
            )}
          </div>
        )}
      </div>

      <TaskEditModal
        task={task}
        projectId={projectId}
        collaborators={collaborators}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSaveTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        onSaved={() => setIsEditOpen(false)}
      />
    </div>
  );
}
