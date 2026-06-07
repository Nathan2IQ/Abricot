// Ce fichier est UNIQUEMENT pour les Server Components
// Il importe "next/headers" donc ne doit JAMAIS être importé par un Client Component

import { cookies } from "next/headers";
import type { Task } from "../types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"; // ← Port 8000 comme dans login

// Helper pour les requêtes CÔTÉ SERVEUR
async function fetchServerWithAuth(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value; // ← CORRIGER : "auth_token" au lieu de "token"

  if (!token) {
    throw new Error("Non authentifié");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Erreur serveur" }));
    throw new Error(error.message || "Erreur lors de la requête");
  }

  return response.json();
}

// API Dashboard pour Server Components
export const dashboardServerAPI = {
  getAssignedTasks: async (): Promise<Task[]> => {
    try {
      const data = await fetchServerWithAuth("/dashboard/assigned-tasks");
      return data.data?.tasks || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches:", error);
      return [];
    }
  },

  getCurrentUser: async () => {
    try {
      const data = await fetchServerWithAuth("/auth/profile"); // ← CORRIGER : "/auth/profile" au lieu de "/auth/me"
      return data.data?.user || null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return null;
    }
  },
};
