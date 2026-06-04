"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Rediriger si non authentifié
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  // Ne rien afficher si pas authentifié (pendant la redirection)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen space-y-6">
      <h1 className="text-4xl font-bold text-[#D3590B]">
        Bienvenue sur votre Dashboard {user?.name || user?.email} !
      </h1>
      <p className="text-lg text-gray-700">
        Ici, vous pouvez gérer vos projets et suivre vos progrès.
      </p>

      {/* Informations utilisateur */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Vos informations</h2>
        <p>
          <strong>Email :</strong> {user?.email}
        </p>
        {user?.name && (
          <p>
            <strong>Nom :</strong> {user.name}
          </p>
        )}
        <p>
          <strong>ID :</strong> {user?.id}
        </p>
      </div>
    </div>
  );
}
