"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserStorage } from "@/app/api/utils";
import { useRouter } from "next/navigation";
import type {
  User,
  AuthContextType,
  LoginRequest,
  RegisterRequest,
} from "@/app/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const savedUser = UserStorage.get();
        if (savedUser) {
          setUser(savedUser);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification:", error);
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
      // Appel au Route Handler Next.js (qui stocke le cookie)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      // Stocker uniquement l'utilisateur (le token est dans le cookie)
      UserStorage.set(data.data.user);
      setUser(data.data.user);

      router.push("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      UserStorage.set(data.data.user);
      setUser(data.data.user);

      router.push("/dashboard");
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    }
  };

  const logout = async () => {
    // Appel au Route Handler pour supprimer le cookie
    await fetch("/api/auth/logout", { method: "POST" });

    UserStorage.remove();
    setUser(null);
    router.push("/");
  };

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
        UserStorage.set(data.data.user);
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement:", error);
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
