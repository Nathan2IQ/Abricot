"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import type { Project } from "@/app/types";

interface ProjectEditModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (payload: { name: string; description?: string }) => Promise<void>;
}

export default function ProjectEditModal({
  project,
  isOpen,
  onClose,
  onSaved,
}: ProjectEditModalProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await onSaved({
        name,
        description,
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
      aria-labelledby="project-edit-title"
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="w-full max-w-xl rounded-2xl bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2
                id="project-edit-title"
                className="text-xl font-semibold text-gray-900"
              >
                Modifier le projet
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Seul le propriétaire du projet peut changer ces informations.
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
                htmlFor="project-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Nom du projet
              </label>
              <input
                id="project-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                required
              />
            </div>

            <div>
              <label
                htmlFor="project-description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="project-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                placeholder="Décris l'objectif du projet"
              />
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
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
