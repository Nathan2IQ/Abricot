import { redirect } from "next/navigation";
import DashboardHeader from "./_components/Header";
import DashboardClient from "./_components/DashboardClient";
import { dashboardServerAPI } from "@/app/api/server-utils"; // ← CHANGER ICI

export default async function DashboardPage() {
  const user = await dashboardServerAPI.getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const tasks = await dashboardServerAPI.getAssignedTasks();

  return (
    <>
      <DashboardHeader userName={user.name} userEmail={user.email} />
      <DashboardClient tasks={tasks} />
    </>
  );
}
