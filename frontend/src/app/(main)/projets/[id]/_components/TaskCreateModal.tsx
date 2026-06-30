"use client";

import { useEffect, useState, type FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import type { Project } from "@/app/types";

type Collaborator = {
  id: string;
  name: string | null;
  email: string;
};

interface TaskCreateModalProps {
  project: Project;
  collaborators: Collaborator[];
  isOpen: boolean;
  onClose: () => void;
  onSaved: (payload: {
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate?: string;
    assigneeIds: string[];
  }) => Promise<void>;
}

type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

function formatDateForInput(dateString?: string) {
  return dateString ? dateString.slice(0, 10) : "";
}

export default function TaskCreateModal({
  project,
  collaborators,
  isOpen,
  onClose,
  onSaved,
}: TaskCreateModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      await onSaved({
        title,
        description,
        priority,
        dueDate: dueDate || undefined,
        assigneeIds,
      });
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-create-title"
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2
                id="task-create-title"
                className="text-xl font-semibold text-gray-900"
              >
                Créer une tâche
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Une tâche sera ajoutée au projet {project.name}.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Fermer la fenêtre de création"
            >
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
            <div>
              <label
                htmlFor="task-create-title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Titre
              </label>
              <input
                id="task-create-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                required
                minLength={2}
                maxLength={200}
              />
            </div>

            <div>
              <label
                htmlFor="task-create-description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="task-create-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                placeholder="Décris brièvement la tâche"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="task-create-priority"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Priorité
                </label>
                <select
                  id="task-create-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value as TaskPriority)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                >
                  <option value="LOW">Basse</option>
                  <option value="MEDIUM">Moyenne</option>
                  <option value="HIGH">Haute</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="task-create-due-date"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Date d&apos;échéance
                </label>
                <input
                  id="task-create-due-date"
                  type="date"
                  value={formatDateForInput(dueDate)}
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

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Création..." : "Créer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
