"use client";

import { useRouter } from "next/navigation";

interface CreateProjectButtonProps {
  onClick?: () => void;
}

export default function CreateProjectButton({
  onClick,
}: CreateProjectButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    router.push("/projets/nouveau");
  };

  return (
    <button
      onClick={handleClick}
      className="px-3 sm:px-5 lg:px-6 py-2 lg:py-3 text-xs sm:text-sm lg:text-base cursor-pointer bg-black text-white rounded-lg sm:rounded-xl shadow-md hover:bg-gray-800 transition-colors"
      aria-label="Créer un nouveau projet"
    >
      <span className="hidden sm:inline">+ Créer un projet</span>
      <span className="sm:hidden">+ Projet</span>
    </button>
  );
}
