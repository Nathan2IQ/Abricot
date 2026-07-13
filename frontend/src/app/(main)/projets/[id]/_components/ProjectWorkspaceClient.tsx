"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, Task } from "@/app/types";
import ProjectHeader from "./ProjectHeader";
import ProjectTasks from "./ProjectTasks";
import ProjectEditModal from "./ProjectEditModal";
import TaskCreateModal from "./TaskCreateModal";
import AITaskModal from "./AITaskModal";

interface ProjectWorkspaceClientProps {
  initialProject: Project;
  initialTasks: Task[];
  currentUser: {
    id: string;
    email: string;
    name?: string;
  };
}

type Collaborator = {
  id: string;
  name: string | null;
  email: string;
};

export default function ProjectWorkspaceClient({
  initialProject,
  initialTasks,
  currentUser,
}: ProjectWorkspaceClientProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Use props directly instead of state to avoid cascading renders
  const project = initialProject;
  const tasks = initialTasks;

  const canEditProject = project.owner.id === currentUser.id;
  const collaborators: Collaborator[] = [
    {
      id: project.owner.id,
      name: project.owner.name,
      email: project.owner.email,
    },
    ...project.members.map((member) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
    })),
  ];

  const handleCreateTask = async (payload: {
    title: string;
    description?: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate?: string;
    assigneeIds: string[];
  }) => {
    const response = await fetch(`/api/projects/${project.id}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Impossible de créer la tâche");
    }

    router.refresh();
  };

  const handleUpdateTask = async (
    taskId: string,
    payload: {
      title: string;
      description?: string;
      status: Task["status"];
      dueDate?: string;
      assigneeIds: string[];
    },
  ) => {
    const response = await fetch(
      `/api/projects/${project.id}/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Impossible de mettre à jour la tâche");
    }

    router.refresh();
  };

  const handleDeleteTask = async (taskId: string) => {
    const response = await fetch(
      `/api/projects/${project.id}/tasks/${taskId}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Impossible de supprimer la tâche");
    }

    router.refresh();
  };

  const handleAddComment = async (taskId: string, content: string) => {
    const response = await fetch(
      `/api/projects/${project.id}/tasks/${taskId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Impossible d'ajouter le commentaire");
    }

    router.refresh();
  };

  const handleSaveProject = async (payload: {
    name: string;
    description?: string;
  }) => {
    const response = await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Impossible de mettre à jour le projet");
    }

    router.refresh();
  };

  return (
    <>
      <ProjectHeader
        project={project}
        currentUserId={currentUser.id}
        onEditProject={() => setIsEditOpen(true)}
        onCreateTask={() => setIsCreateOpen(true)}
        onAICreateTask={() => setIsAIOpen(true)}
      />

      <ProjectTasks
        tasks={tasks}
        projectId={project.id}
        canEdit={canEditProject}
        collaborators={collaborators}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onAddComment={handleAddComment}
      />

      <ProjectEditModal
        project={project}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSaved={handleSaveProject}
      />

      <TaskCreateModal
        project={project}
        collaborators={collaborators}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSaved={handleCreateTask}
      />

      <AITaskModal
        projectId={project.id}
        collaborators={collaborators}
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onTaskCreated={() => router.refresh()}
      />
    </>
  );
}
