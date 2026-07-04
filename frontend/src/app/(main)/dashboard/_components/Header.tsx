"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateProjectButton from "./CreateProjectButton";
import CreateProjectModal from "../../_components/CreateProjectModal";

interface DashboardHeaderProps {
  userName?: string;
  userEmail?: string;
}

export default function DashboardHeader({
  userId,
  userName,
  userEmail,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateProject = async (payload: {
    name: string;
    description?: string;
    contributors: string[];
  }) => {
    console.log("[DashboardHeader] createProject request", payload);

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);
    console.log("[DashboardHeader] createProject response", {
      status: response.status,
      ok: response.ok,
      data,
    });

    if (!response.ok) {
      throw new Error(data?.message || "Impossible de créer le projet");
    }

    router.refresh();
  };

  return (
    <>
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mt-6 sm:mt-10">
        <div className="flex flex-col">
          <h1 className="text-lg sm:text-xl lg:text-3xl font-bold mb-2">
            Tableau de bord
          </h1>
          <p className="text-sm sm:text-base lg:text-lg mb-2 sm:mb-4">
            Bonjour {userName || userEmail}, voici un aperçu de vos projets et
            tâches
          </p>
        </div>
        <CreateProjectButton onClick={() => setIsCreateOpen(true)} />
      </header>

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreateProject}
      />
    </>
  );
}
