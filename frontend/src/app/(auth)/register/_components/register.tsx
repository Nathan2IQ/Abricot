"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useAuthBackground } from "../../context/AuthBackgroundContext";
import Link from "next/dist/client/link";
import { useState, useEffect } from "react";
import type { ApiError } from "@/app/types";

// Fonction de validation du mot de passe (même logique que le backend)
const isValidPassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { setBackgroundImage } = useAuthBackground();

  useEffect(() => {
    // Définir l'image de fond pour la page d'inscription
    setBackgroundImage("/BG_register.jpg");
  }, [setBackgroundImage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation côté client
    if (!email || !password || !name) {
      setError("Tous les champs sont requis");
      setIsLoading(false);
      return;
    }

    if (name.trim().length < 2) {
      setError("Le nom doit contenir au moins 2 caractères");
      setIsLoading(false);
      return;
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format d'email invalide");
      setIsLoading(false);
      return;
    }

    if (!isValidPassword(password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial",
      );
      setIsLoading(false);
      return;
    }

    try {
      await register({ email, password, name });
      // La redirection est gérée dans le contexte
    } catch (err) {
      const apiError = err as ApiError;

      // Gestion des erreurs spécifiques
      if (apiError.message?.includes("email existe déjà")) {
        setError("Cet email est déjà utilisé");
      } else if (apiError.errors && apiError.errors.length > 0) {
        // Erreurs de validation du backend
        setError(apiError.errors.map((e) => e.message).join(", "));
      } else {
        setError(
          apiError.message || "Une erreur est survenue lors de l'inscription",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full space-y-4 sm:space-y-6">
      {/* Formulaire principal */}
      <div className="flex flex-col items-center w-full space-y-4 sm:space-y-6 mt-16 sm:mt-20 lg:mt-28">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#D3590B]">
          Inscription
        </h1>

        {/* Message d'erreur */}
        {error && (
          <div
            className="w-full max-w-xs sm:max-w-sm lg:w-80 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <form className="space-y-3 sm:space-y-4 w-full" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm ml-4 sm:ml-8 lg:ml-16 font-medium text-gray-700"
            >
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md py-2.5 sm:py-3 px-3 sm:px-4 border border-[#E5E7EB] bg-white focus:outline-none focus:ring-[#D3590B] focus:border-[#D3590B] text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
              aria-required="true"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm ml-4 sm:ml-8 lg:ml-16 font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md py-2.5 sm:py-3 px-3 sm:px-4 border border-[#E5E7EB] bg-white focus:outline-none focus:ring-[#D3590B] focus:border-[#D3590B] text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              aria-required="true"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm ml-4 sm:ml-8 lg:ml-16 font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 mx-auto block w-full max-w-xs sm:max-w-sm lg:max-w-md py-2.5 sm:py-3 px-3 sm:px-4 border border-[#E5E7EB] bg-white focus:outline-none focus:ring-[#D3590B] focus:border-[#D3590B] text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              aria-required="true"
              aria-describedby="password-help"
            />

            {/* Message d'aide pour le mot de passe */}
            <p
              id="password-help"
              className="mt-1 text-xs text-gray-600 mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md px-2 sm:px-0"
            >
              Le mot de passe doit contenir :
              <br />• Au moins 8 caractères
              <br />• Une majuscule, une minuscule, un chiffre
              <br />• Un caractère spécial (@$!%*?&)
            </p>
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-48 sm:w-52 lg:w-60 py-2.5 sm:py-3 border rounded-xl sm:rounded-2xl border-transparent text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Inscription en cours..." : "S'inscrire"}
            </button>
          </div>
        </form>
        <button
          type="button"
          className="text-[#BE4E09] underline cursor-pointer bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[#BE4E09] focus:ring-offset-2 rounded px-2 py-1"
          onClick={() => {
            alert("Fonctionnalité à venir");
          }}
          aria-label="Réinitialiser le mot de passe"
        >
          Mot de passe oublié ?
        </button>
      </div>

      {/* Lien créer un compte */}
      <div className="flex justify-center w-full pt-8">
        <p className="text-sm">
          Déjà inscrit ?{" "}
          <Link
            href="/"
            className="text-[#BE4E09] underline font-medium focus:outline-none focus:ring-2 focus:ring-[#BE4E09] focus:ring-offset-2 rounded"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
