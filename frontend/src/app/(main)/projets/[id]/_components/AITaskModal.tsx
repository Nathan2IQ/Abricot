"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faMagic,
  faSpinner,
  faPlus,
  faTrash,
  faCheck,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

interface AITaskModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
  collaborators: Array<{
    id: string;
    name: string | null;
    email: string;
  }>;
}

type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface GeneratedTask {
  id: string; // Temporary ID for editing
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
  assigneeIds?: string[];
}

type Step = "prompt" | "review" | "creating";

export default function AITaskModal({
  projectId,
  isOpen,
  onClose,
  onTaskCreated,
  collaborators,
}: AITaskModalProps) {
  const [step, setStep] = useState<Step>("prompt");
  const [prompt, setPrompt] = useState("");
  const [additionalPrompt, setAdditionalPrompt] = useState("");
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetForm = useCallback(() => {
    setStep("prompt");
    setPrompt("");
    setAdditionalPrompt("");
    setGeneratedTasks([]);
    setIsGenerating(false);
    setIsCreating(false);
    setErrorMessage("");
    setSuccessMessage("");
  }, []);

  const handleClose = useCallback(() => {
    if (!isGenerating && !isCreating) {
      resetForm();
      onClose();
    }
  }, [isGenerating, isCreating, resetForm, onClose]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isGenerating && !isCreating) {
        handleClose();
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
  }, [isOpen, isGenerating, isCreating, handleClose]);

  if (!isOpen) {
    return null;
  }

  const handleGenerateTasks = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsGenerating(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/ai/createTask?action=generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          prompt: prompt.trim(),
          projectId,
        }),
      });

      const responseClone = response.clone();

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        const text = await responseClone.text();
        console.error("[AITaskModal] Invalid JSON response:", text);
        throw new Error("Réponse invalide du serveur");
      }

      if (!response.ok) {
        throw new Error(data.error || "Impossible de générer les tâches");
      }

      // Add temporary IDs for editing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tasksWithIds = data.tasks.map((task: any, index: number) => ({
        ...task,
        id: `temp-${Date.now()}-${index}`,
      }));

      setGeneratedTasks(tasksWithIds);
      setStep("review");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMoreTasks = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!additionalPrompt.trim()) return;

    setIsGenerating(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/ai/createTask?action=generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          prompt: additionalPrompt.trim(),
          projectId,
        }),
      });

      const responseClone = response.clone();
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("[AITaskModal] Failed to parse JSON:", jsonError);
        const text = await responseClone.text();
        console.error("[AITaskModal] Response text:", text);
        throw new Error("Réponse invalide du serveur");
      }

      if (!response.ok) {
        throw new Error(data.error || "Impossible de générer les tâches");
      }

      // Add temporary IDs and append to existing tasks
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tasksWithIds = data.tasks.map((task: any, index: number) => ({
        ...task,
        id: `temp-${Date.now()}-${index}`,
      }));

      setGeneratedTasks([...generatedTasks, ...tasksWithIds]);
      setAdditionalPrompt(""); // Clear the input after success
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateTasks = async () => {
    if (generatedTasks.length === 0) {
      setErrorMessage("Aucune tâche à créer");
      return;
    }

    setIsCreating(true);
    setErrorMessage("");
    setStep("creating");

    try {
      const tasksToCreate = generatedTasks.map(({ id, ...task }) => task);

      const response = await fetch("/api/ai/createTask?action=create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          tasks: tasksToCreate,
          projectId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Impossible de créer les tâches");
      }

      setSuccessMessage(data.message);

      // Wait a bit to show success message, then close and refresh
      setTimeout(() => {
        onTaskCreated();
        resetForm();
        onClose();
      }, 1500);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
      setStep("review"); // Go back to review on error
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddTask = () => {
    const newTask: GeneratedTask = {
      id: `temp-${Date.now()}`,
      title: "",
      description: "",
      priority: "MEDIUM",
      dueDate: undefined,
      assigneeIds: [],
    };
    setGeneratedTasks([...generatedTasks, newTask]);
  };

  const handleUpdateTask = (id: string, updates: Partial<GeneratedTask>) => {
    setGeneratedTasks(
      generatedTasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task,
      ),
    );
  };

  const handleDeleteTask = (id: string) => {
    setGeneratedTasks(generatedTasks.filter((task) => task.id !== id));
  };

  const formatDateForInput = (dateString?: string) => {
    return dateString ? dateString.slice(0, 10) : "";
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70"
      onClick={!isGenerating && !isCreating ? handleClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-task-title"
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 lg:p-6">
        <div
          className="w-full max-w-[95vw] sm:max-w-lg lg:max-w-2xl rounded-lg sm:rounded-2xl bg-white shadow-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col"
          onClick={(event) => event.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
            <div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faStar}
                  className="w-4 h-4 text-[#FF6B35]"
                />
                <h2
                  id="ai-task-title"
                  className="text-base sm:text-lg font-semibold text-gray-900"
                >
                  {step === "prompt" && "Créer une tâche"}
                  {step === "review" && "Vos tâches..."}
                  {step === "creating" && "Création en cours..."}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isGenerating || isCreating}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 cursor-pointer"
              aria-label="Fermer la fenêtre"
            >
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
            {/* Step 1: Prompt */}
            {step === "prompt" && (
              <form onSubmit={handleGenerateTasks} className="space-y-5">
                <div>
                  <label
                    htmlFor="ai-prompt"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Décrivez votre projet
                  </label>
                  <textarea
                    id="ai-prompt"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    rows={8}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                    placeholder="Ex: Créer une application web de gestion de tâches avec authentification, tableau de bord et notifications. Il faut aussi prévoir les tests et le déploiement."
                    required
                    minLength={20}
                    maxLength={2000}
                    disabled={isGenerating}
                  />
                  <p className="mt-1 text-xs text-gray-600">
                    Plus vous êtes précis, plus les tâches générées seront
                    pertinentes
                  </p>
                </div>

                {errorMessage && (
                  <div
                    className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                    role="alert"
                  >
                    {errorMessage}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isGenerating}
                    className="rounded-lg border border-gray-300 px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 cursor-pointer w-full sm:w-auto"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating || !prompt.trim()}
                    className="rounded-lg bg-[#D3590B] px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-medium text-white transition-colors hover:bg-[#b94a09] disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                  >
                    {isGenerating ? (
                      <>
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className="h-4 w-4 animate-spin"
                        />
                        Génération...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faMagic} className="h-4 w-4" />
                        Générer les tâches
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Review Tasks */}
            {step === "review" && (
              <div className="space-y-4">
                {generatedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">
                            Titre
                          </label>
                          <input
                            type="text"
                            value={task.title}
                            onChange={(e) =>
                              handleUpdateTask(task.id, {
                                title: e.target.value,
                              })
                            }
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]"
                            placeholder="Titre de la tâche"
                            required
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">
                            Description
                          </label>
                          <textarea
                            value={task.description || ""}
                            onChange={(e) =>
                              handleUpdateTask(task.id, {
                                description: e.target.value,
                              })
                            }
                            rows={2}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]"
                            placeholder="Description (optionnel)"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                              Priorité
                            </label>
                            <select
                              value={task.priority}
                              onChange={(e) =>
                                handleUpdateTask(task.id, {
                                  priority: e.target.value as TaskPriority,
                                })
                              }
                              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]"
                            >
                              <option value="LOW">Basse</option>
                              <option value="MEDIUM">Moyenne</option>
                              <option value="HIGH">Haute</option>
                              <option value="URGENT">Urgente</option>
                            </select>
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                              Date d&apos;échéance
                            </label>
                            <input
                              type="date"
                              value={formatDateForInput(task.dueDate)}
                              onChange={(e) =>
                                handleUpdateTask(task.id, {
                                  dueDate: e.target.value || undefined,
                                })
                              }
                              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">
                            Assigner à
                          </label>
                          <select
                            multiple
                            value={task.assigneeIds || []}
                            onChange={(e) => {
                              const selectedOptions = Array.from(
                                e.target.selectedOptions,
                                (option) => option.value,
                              );
                              handleUpdateTask(task.id, {
                                assigneeIds: selectedOptions,
                              });
                            }}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]"
                            size={Math.min(collaborators.length, 3)}
                          >
                            {collaborators.map((collab) => (
                              <option key={collab.id} value={collab.id}>
                                {collab.name || collab.email}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 text-xs text-gray-600">
                            Maintenez Ctrl (ou Cmd) pour sélectionner plusieurs
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task.id)}
                        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 cursor-pointer"
                        aria-label="Supprimer cette tâche"
                      >
                        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add more tasks with AI */}
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 bg-gray-50">
                  <form
                    onSubmit={handleGenerateMoreTasks}
                    className="space-y-3"
                  >
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">
                        <FontAwesomeIcon
                          icon={faMagic}
                          className="mr-1 text-[#FF6B35]"
                        />
                        Générer d&apos;autres tâches avec l&apos;IA
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={additionalPrompt}
                          onChange={(e) => setAdditionalPrompt(e.target.value)}
                          placeholder="Ajouter les tâches"
                          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]"
                          disabled={isGenerating}
                        />
                        <button
                          type="submit"
                          disabled={isGenerating || !additionalPrompt.trim()}
                          className="rounded bg-[#D3590B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b94a09] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                          {isGenerating ? (
                            <FontAwesomeIcon
                              icon={faSpinner}
                              className="animate-spin"
                            />
                          ) : (
                            <FontAwesomeIcon icon={faPlus} />
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">
                        Les nouvelles tâches s&apos;ajouteront à la liste
                        existante
                      </p>
                    </div>
                  </form>
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleAddTask}
                    className="rounded-lg border-2 bg-black px-4 py-3 text-sm font-medium text-white cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Ajouter une tâche manuellement
                  </button>
                </div>

                {errorMessage && (
                  <div
                    className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                    role="alert"
                  >
                    {errorMessage}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("prompt")}
                    className="rounded-lg border border-gray-300 px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer w-full sm:w-auto"
                  >
                    ← Retour
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateTasks}
                    disabled={generatedTasks.length === 0}
                    className="rounded-lg bg-black px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                  >
                    <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
                    Créer {generatedTasks.length} tâche(s)
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Creating */}
            {step === "creating" && (
              <div className="flex flex-col items-center justify-center py-12">
                {successMessage ? (
                  <div className="text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="h-8 w-8 text-green-600"
                      />
                    </div>
                    <p className="text-lg font-medium text-gray-900">
                      {successMessage}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="h-12 w-12 animate-spin text-[#D3590B] mb-4"
                    />
                    <p className="text-lg font-medium text-gray-900">
                      Création des tâches en cours...
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      Veuillez patienter
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
