"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, Task } from "@/app/types";
import ProjectHeader from "./ProjectHeader";
import ProjectTasks from "./ProjectTasks";
import ProjectEditModal from "./ProjectEditModal";
import TaskCreateModal from "./TaskCreateModal";

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
  const [project, setProject] = useState(initialProject);
  const [tasks, setTasks] = useState(initialTasks);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    setProject(initialProject);
  }, [initialProject]);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

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
    console.log("[ProjectWorkspaceClient] createTask request", {
      projectId: project.id,
      payload,
    });

    const response = await fetch(`/api/projects/${project.id}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);
    console.log("[ProjectWorkspaceClient] createTask response", {
      status: response.status,
      ok: response.ok,
      data,
    });

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
    console.log("[ProjectWorkspaceClient] updateTask request", {
      projectId: project.id,
      taskId,
      payload,
    });

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
    console.log("[ProjectWorkspaceClient] updateTask response", {
      status: response.status,
      ok: response.ok,
      data,
    });

    if (!response.ok) {
      throw new Error(data?.message || "Impossible de mettre à jour la tâche");
    }

    router.refresh();
  };

  const handleDeleteTask = async (taskId: string) => {
    console.log("[ProjectWorkspaceClient] deleteTask request", {
      projectId: project.id,
      taskId,
    });

    const response = await fetch(
      `/api/projects/${project.id}/tasks/${taskId}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json().catch(() => null);
    console.log("[ProjectWorkspaceClient] deleteTask response", {
      status: response.status,
      ok: response.ok,
      data,
    });

    if (!response.ok) {
      throw new Error(data?.message || "Impossible de supprimer la tâche");
    }

    router.refresh();
  };

  const handleAddComment = async (taskId: string, content: string) => {
    console.log("[ProjectWorkspaceClient] createComment request", {
      projectId: project.id,
      taskId,
      content,
    });

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
    console.log("[ProjectWorkspaceClient] createComment response", {
      status: response.status,
      ok: response.ok,
      data,
    });

    if (!response.ok) {
      const debugText =
        data?.proxyDebugText ||
        (data?.proxyDebug
          ? JSON.stringify(data.proxyDebug)
          : "Aucun contexte proxy");

      console.error(
        "[ProjectWorkspaceClient] createComment forbidden context",
        {
          status: response.status,
          message: data?.message,
          error: data?.error,
          proxyDebug: data?.proxyDebug,
          proxyDebugText: debugText,
        },
      );
      throw new Error(
        `${data?.message || "Impossible d'ajouter le commentaire"} (${debugText})`,
      );
    }

    router.refresh();
  };

  const handleSaveProject = async (payload: {
    name: string;
    description?: string;
  }) => {
    console.log("[ProjectWorkspaceClient] updateProject request", {
      projectId: project.id,
      payload,
    });

    const response = await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);
    console.log("[ProjectWorkspaceClient] updateProject response", {
      status: response.status,
      ok: response.ok,
      data,
    });

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
    </>
  );
}
