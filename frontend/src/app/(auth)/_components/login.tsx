"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import type { ApiError } from "@/app/types";
import LoginForm from "./LoginForm";
import LoginLinks from "./LoginLinks";

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Veuillez remplir tous les champs.");
        return;
      }

      await login({ email, password });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(
        apiError.message || "Identifiants incorrects. Veuillez réessayer.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full space-y-6">
      <div className="flex flex-col items-center w-full space-y-6 mt-30">
        <h1 className="text-3xl font-bold text-[#D3590B]">Connexion</h1>
        <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
        <LoginLinks />
      </div>
    </div>
  );
}
