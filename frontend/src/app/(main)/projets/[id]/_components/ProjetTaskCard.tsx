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
import { getInitials, getStatusBadge } from "@/lib/utils";

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

// Fonction pour formater la date (format court : "25 janvier")
function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Pas d'échéance";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
  };
  return date.toLocaleDateString("fr-FR", options);
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
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 hover:shadow-md transition-shadow">
      {/* En-tête : Titre + Badge statut + Menu actions */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 wrap-break-words">
              {task.title}
            </h3>
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs lg:text-sm font-medium ${statusBadge.className} self-start`}
            >
              {statusBadge.label}
            </span>
          </div>
          {/* Description */}
          {task.description && (
            <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-4 wrap-break-words">
              {task.description}
            </p>
          )}
        </div>

        {/* Menu 3 points */}
        {canEdit && (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 sm:p-3 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D3590B] focus:ring-offset-2"
              aria-label="Menu d'actions de la tâche"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <FontAwesomeIcon
                icon={faEllipsisV}
                className="w-3 h-3 sm:w-4 sm:h-4 cursor-pointer text-gray-600"
                aria-hidden="true"
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
            className="w-4 h-4 text-gray-600 ml-1"
          />
        </span>
        <span className="text-sm text-gray-700 font-medium">
          {formatDate(task.dueDate)}
        </span>
      </div>

      {/* Collaborateurs assignés */}
      {task.assignees && task.assignees.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-600 font-medium mb-2">Assigné à :</p>
          <div className="flex flex-wrap gap-2">
            {task.assignees.map((assignee) => (
              <div
                key={assignee.id}
                className="inline-flex items-center gap-2 px-3 py-1  rounded-full"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 text-gray-700 text-xs font-semibold">
                  {getInitials(assignee.user.name || assignee.user.email)}
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
                className="block text-xs font-medium text-gray-700 mb-2"
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
                      {getInitials(comment.author.name || comment.author.email)}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {comment.author.name || comment.author.email}
                    </span>
                    <span className="text-xs text-gray-600">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 pl-8">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 italic py-2">
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
