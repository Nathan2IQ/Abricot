import { redirect, notFound } from "next/navigation";
import ProjectHeader from "./_components/ProjectHeader";
import ProjectTasks from "./_components/ProjectTasks";
import { dashboardServerAPI } from "@/app/api/server-utils";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;

  // Vérifier l'authentification
  const user = await dashboardServerAPI.getCurrentUser();
  if (!user) {
    redirect("/");
  }

  // Récupérer le projet
  const project = await dashboardServerAPI.getProjectById(id);
  if (!project) {
    notFound(); // Affiche la page 404 si le projet n'existe pas
  }

  // Récupérer les tâches du projet
  const tasks = await dashboardServerAPI.getProjectTasks(id);

  return (
    <div className="flex flex-col gap-6 p-6">
      <ProjectHeader project={project} />
      <ProjectTasks tasks={tasks} />
    </div>
  );
}
