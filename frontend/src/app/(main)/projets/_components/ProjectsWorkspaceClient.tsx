"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import ProjectsSection from "./ProjectsSection";
import type { Project, User } from "@/app/types";
import CreateProjectModal from "../../_components/CreateProjectModal";

interface ProjectsWorkspaceClientProps {
  initialProjects: Project[];
  currentUser: User;
}

export default function ProjectsWorkspaceClient({
  initialProjects,
  currentUser: _currentUser,
}: ProjectsWorkspaceClientProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateProject = async (payload: {
    name: string;
    description?: string;
    contributors: string[];
  }) => {
    console.log("[ProjectsWorkspaceClient] createProject request", payload);

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);
    console.log("[ProjectsWorkspaceClient] createProject response", {
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
      <Header onCreateProject={() => setIsCreateOpen(true)} />
      <ProjectsSection projects={initialProjects} />
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreateProject}
      />
    </>
  );
}
