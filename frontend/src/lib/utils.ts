/**
 * Utilitaires partagés pour l'application
 */

/**
 * Extrait les initiales d'un nom ou email
 * @param name - Le nom complet ou l'email de l'utilisateur
 * @returns Les initiales en majuscules (2 caractères max)
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "??";

  const words = name.trim().split(/\s+/);

  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  return words[0].substring(0, 2).toUpperCase();
}

/**
 * Formate une date au format français
 * @param dateString - Date ISO string
 * @returns Date formatée (ex: "01/12/2024") ou message par défaut
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return "Pas de date limite";

  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Formate une date avec l'heure au format français
 * @param dateString - Date ISO string
 * @returns Date et heure formatées (ex: "01/12/2024 14:30")
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formate une date pour un input HTML date
 * @param dateString - Date ISO string
 * @returns Date au format YYYY-MM-DD
 */
export function formatDateForInput(dateString?: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

/**
 * Obtient la classe CSS pour un statut de tâche
 * @param status - Le statut de la tâche
 * @returns Classes Tailwind pour le badge de statut
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DONE: "bg-[#F1FFF7] text-[#27AE60]",
    IN_PROGRESS: "bg-[#FFF0D7] text-[#9E5C00]",
    TODO: "bg-[#FFE0E0] text-[#CE1212]",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

/**
 * Obtient le label français pour un statut de tâche
 * @param status - Le statut de la tâche
 * @returns Le label traduit en français
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    TODO: "À faire",
    IN_PROGRESS: "En cours",
    DONE: "Terminé",
  };
  return labels[status] || status;
}

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

/**
 * Obtient le badge complet (label + couleur) pour un statut
 * @param status - Le statut de la tâche
 * @returns Objet avec le label et les classes CSS
 */
export function getStatusBadge(status: TaskStatus): {
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
        className: "bg-[#FFF4F0] text-[#BE4E09]",
      };
    case "DONE":
      return {
        label: "Terminé",
        className: "bg-green-100 text-green-700",
      };
  }
}
