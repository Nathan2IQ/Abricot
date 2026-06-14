import { redirect } from "next/navigation";
import Header from "./_components/Header";
import ProjectsSection from "./_components/ProjectsSection";
import { dashboardServerAPI } from "@/app/api/server-utils";

export default async function ProjetsPage() {
  const user = await dashboardServerAPI.getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const projects = await dashboardServerAPI.getProjects();

  return (
    <div className="flex flex-col gap-4">
      <Header />
      <ProjectsSection projects={projects} />
    </div>
  );
}
