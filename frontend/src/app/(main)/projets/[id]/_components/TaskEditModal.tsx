"use client";

import { useEffect, useState, type FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import type { Task } from "@/app/types";

interface TaskEditModalProps {
  task: Task;
  projectId: string;
  collaborators: Array<{ id: string; name: string | null; email: string }>;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  onSaveTask: (
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
}

function toDateInputValue(dateString?: string) {
  return dateString ? dateString.slice(0, 10) : "";
}

export default function TaskEditModal({
  task,
  projectId,
  collaborators,
  isOpen,
  onClose,
  onSaved,
  onSaveTask,
  onDeleteTask,
}: TaskEditModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<Task["status"]>(task.status);
  const [dueDate, setDueDate] = useState(toDateInputValue(task.dueDate));
  const [assigneeIds, setAssigneeIds] = useState(
    task.assignees.map((assignee) => assignee.user.id),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
      setDueDate(toDateInputValue(task.dueDate));
      setAssigneeIds(task.assignees.map((assignee) => assignee.user.id));
      setErrorMessage("");
    }
  }, [isOpen, task]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await onSaveTask(task.id, {
        title,
        description,
        status,
        dueDate: dueDate || undefined,
        assigneeIds,
      });
      onSaved();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Supprimer cette tâche ? Cette action est définitive.",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    try {
      await onDeleteTask(task.id);
      onSaved();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-edit-title"
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2
                id="task-edit-title"
                className="text-xl font-semibold text-gray-900"
              >
                Modifier la tâche
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Les changements seront visibles immédiatement après sauvegarde.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Fermer la fenêtre de modification"
            >
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
            <div>
              <label
                htmlFor="task-title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Titre
              </label>
              <input
                id="task-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                required
              />
            </div>

            <div>
              <label
                htmlFor="task-description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="task-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="task-status"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Statut
                </label>
                <select
                  id="task-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as Task["status"])
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                >
                  <option value="TODO">À faire</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="DONE">Terminé</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="task-due-date"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Date d'échéance
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 block text-sm font-medium text-gray-700">
                Collaborateurs assignés
              </p>
              <div className="grid gap-2 max-h-44 overflow-y-auto rounded-lg border border-gray-200 p-3">
                {collaborators.map((collaborator) => {
                  const checked = assigneeIds.includes(collaborator.id);
                  return (
                    <label
                      key={collaborator.id}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          setAssigneeIds((current) =>
                            event.target.checked
                              ? [...current, collaborator.id]
                              : current.filter((id) => id !== collaborator.id),
                          );
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-[#D3590B] focus:ring-[#FF6B35]"
                      />
                      <span className="text-sm text-gray-700">
                        {collaborator.name || collaborator.email}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {errorMessage && (
              <p
                className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isSubmitting}
                className="rounded-lg border border-red-300 px-5 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Suppression..." : "Supprimer la tâche"}
              </button>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isDeleting}
                  className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
