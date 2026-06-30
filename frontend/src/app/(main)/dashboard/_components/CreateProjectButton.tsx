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
      className="px-6 py-3 cursor-pointer bg-black text-white rounded-xl shadow-md hover:bg-gray-800 transition-colors"
      aria-label="Créer un nouveau projet"
    >
      + Créer un projet
    </button>
  );
}
