// Configuration de base
const API_BASE_URL = "http://localhost:8000";

import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

// Gestion du token JWT
export const TokenStorage = {
  get: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  set: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },

  remove: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },
};

// Gestion des données utilisateur
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
  const token = TokenStorage.get();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

// API Authentication
export const authAPI = {
  // Inscription
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    return fetchWithAuth("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Connexion
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  // Récupérer le profil
  getProfile: async () => {
    return fetchWithAuth("/auth/profile", {
      method: "GET",
    });
  },

  // Déconnexion (côté client)
  logout: () => {
    TokenStorage.remove();
    UserStorage.remove();
  },
};
