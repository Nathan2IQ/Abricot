// PAS de "use client" ici, mais utilisé par des Client Components
// NE PAS importer "next/headers" ici !

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

// Gestion des données utilisateur uniquement (pas le token)
export const UserStorage = {
  get: () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  set: (user: unknown): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  remove: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  },
};

// Helper pour les requêtes avec authentification
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

// API Authentication
export const authAPI = {
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    return fetchWithAuth("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async () => {
    return fetchWithAuth("/auth/profile", {
      method: "GET",
    });
  },
};
