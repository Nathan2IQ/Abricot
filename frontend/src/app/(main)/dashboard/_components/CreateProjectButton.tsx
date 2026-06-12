"use client";

import { useRouter } from "next/navigation";

export default function CreateProjectButton() {
  const router = useRouter();

  const handleClick = () => {
    // Navigation vers la page de création de projet
    router.push("/projets/nouveau");
  };

  return (
    <button
      onClick={handleClick}
      className="px-6 py-3 bg-black text-white rounded-xl shadow-md hover:bg-gray-800 transition-colors"
      aria-label="Créer un nouveau projet"
    >
      +Créer un projet
    </button>
  );
}
