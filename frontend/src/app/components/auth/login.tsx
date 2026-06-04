"use client";

import Link from "next/dist/client/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI, TokenStorage, UserStorage } from "@/app/api/utils";

export default function Login() {
  const router = useRouter();

  // State pour les champs du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fonction de gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Veuillez remplir tous les champs.");
        setLoading(false);
        return;
      }

      const response = await authAPI.login({ email, password });

      TokenStorage.set(response.data.token);
      UserStorage.set(response.data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(
        (err as { message: string })?.message || "Une erreur est survenue.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full space-y-6">
      {/* Formulaire principal */}
      <div className="flex flex-col items-center w-full space-y-6 mt-30">
        <h1 className="text-3xl font-bold text-[#D3590B]">Connexion</h1>
        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm ml-16 font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block mx-auto w-80 py-4 px-4 border border-[#E5E7EB] bg-white focus:outline-none focus:ring-[#D3590B] focus:border-[#D3590B] sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm ml-16 font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 mx-auto block w-80 py-4 px-4 border border-[#E5E7EB] bg-white focus:outline-none focus:ring-[#D3590B] focus:border-[#D3590B] sm:text-sm"
            />
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-60 py-4 cursor-pointer border rounded-2xl border-transparent font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <p className="text-[#D3590B] underline cursor-pointer">
          Mot de passe oublié ?
        </p>
      </div>

      {/* Lien créer un compte */}
      <div className="flex justify-center w-full pt-8 mt-30">
        <p className="text-sm">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="text-[#D3590B] underline font-medium"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
