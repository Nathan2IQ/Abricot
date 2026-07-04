"use client";

import { useState } from "react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string;
}

export default function LoginForm({
  onSubmit,
  loading,
  error,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <>
      {error && (
        <div
          className="w-full max-w-xs sm:max-w-sm lg:w-80 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      <form className="space-y-4 w-full" onSubmit={handleSubmit}>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="mt-1 block mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md py-2.5 sm:py-3 px-3 sm:px-4 border border-[#E5E7EB] bg-white focus:outline-none focus:ring-[#D3590B] focus:border-[#D3590B] text-sm"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="mt-1 mx-auto block w-full max-w-xs sm:max-w-sm lg:max-w-md py-2.5 sm:py-3 px-3 sm:px-4 border border-[#E5E7EB] bg-white focus:outline-none focus:ring-[#D3590B] focus:border-[#D3590B] text-sm"
            required
            aria-required="true"
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-48 sm:w-52 lg:w-60 py-2.5 sm:py-3 cursor-pointer border rounded-xl sm:rounded-2xl border-transparent text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            aria-busy={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </div>
      </form>
    </>
  );
}
