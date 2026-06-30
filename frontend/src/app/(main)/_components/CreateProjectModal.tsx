"use client";

import { useEffect, useState, type FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: {
    name: string;
    description?: string;
    contributors: string[];
  }) => Promise<void>;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSave,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contributorsInput, setContributorsInput] = useState("");
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
      setName("");
      setDescription("");
      setContributorsInput("");
      setErrorMessage("");
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

    const contributors = contributorsInput
      .split(/[\n,;]/)
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    try {
      await onSave({
        name,
        description,
        contributors,
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
      aria-labelledby="project-create-title"
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="w-full max-w-xl rounded-2xl bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2
                id="project-create-title"
                className="text-xl font-semibold text-gray-900"
              >
                Créer un projet
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Renseigne le titre, la description et les collaborateurs à
                inviter.
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
                htmlFor="project-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Titre
              </label>
              <input
                id="project-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                required
                minLength={2}
                maxLength={120}
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
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                placeholder="Décris l'objectif du projet"
              />
            </div>

            <div>
              <label
                htmlFor="project-contributors"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Collaborateurs
              </label>
              <textarea
                id="project-contributors"
                value={contributorsInput}
                onChange={(event) => setContributorsInput(event.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                placeholder="Email1, email2, email3"
              />
              <p className="mt-2 text-xs text-gray-500">
                Sépare les emails par une virgule, un point-virgule ou un retour
                à la ligne.
              </p>
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
