import { redirect } from "next/navigation";
import ProjectsWorkspaceClient from "./_components/ProjectsWorkspaceClient";
import { dashboardServerAPI } from "@/app/api/server-utils";

export default async function ProjetsPage() {
  const user = await dashboardServerAPI.getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const projects = await dashboardServerAPI.getProjects();

  return (
    <ProjectsWorkspaceClient initialProjects={projects} currentUser={user} />
  );
}
