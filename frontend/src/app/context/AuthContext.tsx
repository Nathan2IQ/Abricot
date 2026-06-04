"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, TokenStorage, UserStorage } from "@/app/api/utils";
import { useRouter } from "next/navigation";
import type {
  User,
  AuthContextType,
  LoginRequest,
  RegisterRequest,
} from "@/app/types";

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    async function checkAuth() {
      try {
        const token = TokenStorage.get();
        const savedUser = UserStorage.get();

        if (token && savedUser) {
          // Vérifier si le token est toujours valide
          const profile = await authAPI.getProfile();
          setUser(profile.data.user);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'authentification:",
          error,
        );
        // Token invalide ou expiré, nettoyer
        TokenStorage.remove();
        UserStorage.remove();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authAPI.login(credentials);

      // Stocker le token et l'utilisateur
      TokenStorage.set(response.data.token);
      UserStorage.set(response.data.user);
      setUser(response.data.user);

      // Redirection vers le dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error; // Propager l'erreur au composant
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const response = await authAPI.register(userData);

      // Stocker le token et l'utilisateur
      TokenStorage.set(response.data.token);
      UserStorage.set(response.data.user);
      setUser(response.data.user);

      // Redirection vers le dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw error; // Propager l'erreur au composant
    }
  };

  const logout = () => {
    // Nettoyer le stockage
    TokenStorage.remove();
    UserStorage.remove();
    setUser(null);

    // Redirection vers la page de login
    router.push("/");
  };

  const refreshUser = async () => {
    try {
      const profile = await authAPI.getProfile();
      setUser(profile.data.user);
      UserStorage.set(profile.data.user);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du profil:", error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
